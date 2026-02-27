import type { FastifyReply, FastifyRequest } from 'fastify';

export function roleMiddleware(requiredRole: 'ADMIN' | 'USER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user.role !== requiredRole) {
      return reply.status(403).send({
        message: 'Forbidden',
      });
    }
  };
}
