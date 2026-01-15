import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyJwt from '@fastify/jwt'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getUserProfile } from './routes/auth/get-profile'
import { erroHandler } from './error-handler'
import { requestPasswordRecovery } from './routes/auth/request-password-recovery'

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

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getUserProfile)
app.register(requestPasswordRecovery)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
