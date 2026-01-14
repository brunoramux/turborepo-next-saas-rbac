import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    /**
     * Retrieves the current user's ID from the JWT token.
     * @returns A promise that resolves to the user ID as a string.
     * @throws UnauthorizedError if the token is invalid or missing.
     */
    getCurrentUserId(): Promise<string>
  }
}
