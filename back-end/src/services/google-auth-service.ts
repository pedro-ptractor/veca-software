import { verifyGoogleIdToken } from '../lib/google-client.js';
import { prisma } from '../lib/prisma.js';
import { UserPrismaRepository } from '../repositories/prisma/user-prisma-repository.js';

export class GoogleAuthService {
  private userRepository = new UserPrismaRepository(prisma);

  /**
   * Register or login a user using Google ID Token.
   * Validates the token, extracts googleId, email and name from it.
   */
  async registerOrLogin(idToken: string) {
    const { email, name, sub: googleId } = await verifyGoogleIdToken(idToken);

    // Try find by googleId
    const byGoogle = await this.userRepository.findByGoogleId(googleId);

    if (byGoogle) return byGoogle;

    // Try find by email
    const byEmail = await this.userRepository.findByEmail(email);

    if (byEmail) {
      // Link googleId to existing account
      await this.userRepository.linkGoogleId(byEmail.id, googleId);
      return { ...byEmail, googleId } as any;
    }

    // Create new user without password (Google validated on client)
    const user = await this.userRepository.create({
      name,
      email,
      phone: '',
      googleId,
    });

    return user;
  }
}
