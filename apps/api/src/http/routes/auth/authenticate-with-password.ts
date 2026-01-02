import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { verifyPassword } from '../../../lib/encrypt'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user with email and password',
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const user = await prisma.user.findUnique({
        where: { email },
      })

      console.log('User found:', user)

      if (!user) {
        return reply.status(400).send({ message: 'Invalid email or password' })
      }

      if (!user.passwordHash) {
        return reply.status(400).send({
          message: 'User does not have a password set. Use social login',
        })
      }

      const isPasswordValid = await verifyPassword(password, user.passwordHash)

      console.log('Is password valid:', isPasswordValid)

      if (!isPasswordValid) {
        return reply.status(400).send({ message: 'Invalid email or password' })
      }

      const token = app.jwt.sign({ sub: user.id, expiresIn: '7 days' })

      return reply.status(201).send({ token })
    }
  )
}
