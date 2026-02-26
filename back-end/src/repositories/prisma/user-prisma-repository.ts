import {
  Prisma,
  PrismaClient,
  type User,
} from '../../generated/prisma/client.js';

export class UserPrismaRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash?: string;
    phone: string;
    googleId?: string;
  }) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async linkGoogleId(userId: string, googleId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
      select: { id: true, googleId: true },
    });
  }
}
