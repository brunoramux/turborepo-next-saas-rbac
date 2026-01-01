import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.string(),
        },
      },
    },
    (request, response) => {
      const body = request.body
      console.log('Creating user:', body)
      return response.status(201).send(JSON.stringify(body))
    }
  )
}
