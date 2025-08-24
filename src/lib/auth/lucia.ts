import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/db';
import { dev } from '$app/environment';

const adapter = new PrismaAdapter(
  prisma.session, // delegate for Session model
  prisma.user     // delegate for User model
);

export const lucia = new Lucia(adapter, {
  sessionCookie: { attributes: { secure: !dev, sameSite: 'lax', path: '/' } },
  getUserAttributes: (user) => ({ email: user.email })
});

// Type augmentation (so `locals.user` has `email`)
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { email: string };
  }
}
