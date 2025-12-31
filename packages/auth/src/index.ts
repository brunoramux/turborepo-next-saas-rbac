import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { User } from './models/user'
import { permissions } from './permissions'
import { UserSubject } from './subjects/user'
import { ProjectSubject } from './subjects/project'
import { BillingSubject } from './subjects/billing'
import { InviteSubject } from './subjects/invite'
import { OrganizationSubject } from './subjects/organization'

// manage is a special action that represents any action
// all is a special subject that represents any subject
// Subject types define the entities in your application and the respective actions that can be performed on them
type AppAbilities =
  | UserSubject
  | ProjectSubject
  | BillingSubject
  | InviteSubject
  | OrganizationSubject
  | ['manage', 'all']

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export * from './models/user.ts'
export * from './models/project.ts'

// FUNCAO A SER UTILIZADA PRA TESTAR EXTERNAMENTE AS PERMISSOES DO USUARIO
export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  // TESTA SE A FUNCAO DE PERMISSOES PARA A ROLE DO USUARIO EXISTE
  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`No permissions defined for role: ${user.role}`)
  }

  // RETORNA CONFIGURACAO DE PERMISSOES PARA O USUARIO INFORMADO
  permissions[user.role](user, builder)

  // CONFIG PARA IDENTIFICAR O TIPO DE CADA SUBJECT. __TYPENAME ESTÁ NOS MODELS
  // PERMITE QUE EU CONSIGA ACESSAR DADOS ESPECIFICOS DE CADA SUBJECT COMO O OWNERID DO PROJECT
  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  return ability
}
