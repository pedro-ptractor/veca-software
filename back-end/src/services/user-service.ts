import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { UserPrismaRepository } from '../repositories/prisma/user-prisma-repository.js';
import { HttpError } from '../erros/index.js';

export class UserService {
  async register({
    name,
    email,
    password,
    phone,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const userRepository = new UserPrismaRepository(prisma);

    const existing = await userRepository.findByEmail(email);

    if (existing) {
      throw new HttpError('Email already in use', 401);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      passwordHash: hashedPassword,
      phone,
    });

    return user;
  }

  async login({ email, password }: { email: string; password: string }) {
    const userRepository = new UserPrismaRepository(prisma);

    const user = await userRepository.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new HttpError('Invalid credentials', 401);
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      throw new HttpError('Invalid credentials', 401);
    }

    return user;
  }
}
