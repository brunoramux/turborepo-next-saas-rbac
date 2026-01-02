import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function getUserProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get user profile.',
        response: {
          200: z.object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.email(),
            createdAt: z.date(),
            updatedAt: z.date(),
            avatarUrl: z.url().nullable(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const token = await request.jwtVerify<{ sub: string }>()
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        })

        if (!user) {
          return reply.status(401).send({ message: 'Unauthorized' })
        }

        return reply.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatarUrl: user.avatarUrl,
        })
      } catch {
        return reply.status(401).send({ message: 'Unauthorized' })
      }
    }
  )
}
