import type { FastifyInstance } from 'fastify';
import { register, googleAuth, login } from '../controllers/user-controller.js';

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/google', googleAuth);
}
