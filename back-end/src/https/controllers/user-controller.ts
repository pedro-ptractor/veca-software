import z from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../../services/user-service.js';
import { GoogleAuthService } from '../../services/google-auth-service.js';

const userService = new UserService();
const googleAuthService = new GoogleAuthService();

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const bodySchema = z.object({
      name: z.string().min(1, 'Nome é obrigatório'),
      email: z.email('Email inválido'),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
      phone: z.string().min(1, 'Telefone é obrigatório'),
    });

    const { name, email, password, phone } = bodySchema.parse(request.body);

    const user = await userService.register({
      name,
      email,
      password,
      phone,
    });

    const token = await reply.jwtSign({ sub: user.id, role: user.role });

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function googleAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const bodySchema = z.object({
      idToken: z.string().min(1, 'ID Token é obrigatório'),
    });

    const { idToken } = bodySchema.parse(request.body);

    const user = await googleAuthService.registerOrLogin(idToken);

    const token = await reply.jwtSign({ sub: user.id, role: user.role });

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const bodySchema = z.object({
      email: z.email('Email inválido'),
      password: z.string().min(1, 'Senha é obrigatória'),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await userService.login({ email, password });

    const token = await reply.jwtSign({ sub: user.id, role: user.role });

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
