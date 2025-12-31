import { defineAbilityFor, projectSchema } from '@saas/auth'

// TESTANDO AS PERMISSOES EM PROJETOS COM O USUARIO MEMBER E OWNERID IGUAL AO ID DO USUARIO
// NECESSARIO USAR O PARSE
const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-1' })

const project = projectSchema.parse({
  id: 'project-1',
  name: 'Project 1',
  ownerId: 'user-1',
})

const userCanInvite = ability.can('delete', project)
console.log(`User can delete: ${userCanInvite}`)
