import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth'
import { auth } from '../../middlewares/auth.js'
import { UnauthorizedError } from '../_errors/unauthorized-error.js'
import { prisma } from '../../../lib/prisma.js'
import { BadRequestError } from '../_errors/bad-request-error.js'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params
        const { membership, organization } =
          await request.getUserMembership(slug)
        const { transferToUserId } = request.body

        const authUser = userSchema.parse({
          id: userId,
          role: membership.role,
        })

        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.userId,
        })

        const ability = defineAbilityFor(authUser)

        if (ability.cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to transfer this organization ownership.'
          )
        }

        // Verifica se o usuário que receberá o ownership faz parte da organização solicitada.
        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError('User is not a member of this organization')
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),
          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              userId: transferToUserId,
            },
          }),
        ])

        return reply.status(204).send()
      }
    )
}
