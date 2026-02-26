import { OAuth2Client } from 'google-auth-library';
import { env } from '../env/index.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface GooglePayload {
  sub: string; // googleId
  email: string;
  name: string;
  email_verified?: boolean;
  picture?: string;
}

/**
 * Verify Google ID Token and extract payload
 * @throws Error if token is invalid or verification fails
 */
export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GooglePayload> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token: empty payload');
    }

    // Validate required fields
    if (!payload.sub || !payload.email || !payload.name) {
      throw new Error(
        'Google token missing required fields (sub, email, name)',
      );
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      email_verified: payload.email_verified ? true : false,
      picture: payload.picture ? payload.picture : '',
    };
  } catch (error) {
    throw new Error(
      `Google token verification failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
