import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth'

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Delete a Organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        // Get current user ID
        const userId = await request.getCurrentUserId()
        // Get organization by slug
        const { slug } = request.params
        // Get user membership in the organization
        const { membership, organization } =
          await request.getUserMembership(slug)

        // Define user for authorization
        const authUser = userSchema.parse({
          id: userId,
          role: membership.role,
        })

        // Define organization for authorization
        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.userId,
        })

        const { cannot } = defineAbilityFor(authUser)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to delete this organization.'
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
