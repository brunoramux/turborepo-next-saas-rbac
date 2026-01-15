import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import createSlug from '../../../utils/create-slug'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create a new Organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationDomain = await prisma.organization.findUnique({
            where: {
              domain,
            },
          })

          if (organizationDomain) {
            throw new BadRequestError(
              'Another organization with same domain name alredy exists.'
            )
          }
        }
        console.log(domain)

        const organization = await prisma.organization.create({
          data: {
            name,
            domain: domain === '' ? null : domain,
            slug: createSlug(name),
            shouldAttachUsersByDomain,
            userId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      }
    )
}
