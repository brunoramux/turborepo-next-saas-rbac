import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { hashPassword } from '../../../lib/encrypt'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new user account',
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            newUser: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        return reply.status(400).send({
          message: 'Email already in use. Please use a different email.',
        })
      }

      try {
        const hashedPassword = await hashPassword(password)
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash: hashedPassword,
          },
        })

        if (newUser) {
          reply.status(201).send({
            newUser: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
            },
          })
        }
      } catch (e) {
        return reply.status(400).send({
          message: 'Error creating user. Please try again.',
        })
      }
    }
  )
}
