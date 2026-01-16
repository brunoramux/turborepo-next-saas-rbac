import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyJwt from '@fastify/jwt'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password.js'
import { getUserProfile } from './routes/auth/get-profile.js'
import { erroHandler } from './error-handler.js'
import { requestPasswordRecovery } from './routes/auth/request-password-recovery.js'
import { createOrganization } from './routes/orgs/create-organization.js'
import { getMembership } from './routes/orgs/get-membership.js'
import { getOrganization } from './routes/orgs/get-organization.js'
import { getOrganizations } from './routes/orgs/get-organizations.js'
import { shutdownOrganization } from './routes/orgs/shutdown-organization.js'
import { resetPassword } from './routes/auth/reset-password.js'
import { transferOrganization } from './routes/orgs/transfer-organization.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.JS SaaS with RBAC',
      description: 'Full Stack SaaS App',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.setErrorHandler(erroHandler)

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.get('/healthcheck', async () => {
  return { status: 'ok' }
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getUserProfile)
app.register(requestPasswordRecovery)
app.register(resetPassword)
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
