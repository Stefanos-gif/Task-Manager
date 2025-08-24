// src/routes/api/auth/signup/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { lucia } from '$lib/auth/lucia';
import { Argon2id } from 'oslo/password';

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof raw !== 'object' || raw === null) {
    return json({ error: 'Body must be an object' }, { status: 400 });
  }

  const { email, password } = raw as Record<string, unknown>;
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return json({ error: 'Invalid email' }, { status: 422 });
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return json({ error: 'Password must be 8–72 characters' }, { status: 422 });
  }

  const passwordHash = await new Argon2id().hash(password);

  try {
    const user = await prisma.user.create({
      data: { email: email.toLowerCase().trim(), passwordHash }
    });

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);

    // 🔧 Force `path` so types line up
    cookies.set(cookie.name, cookie.value, {
      ...cookie.attributes,
      path: cookie.attributes.path ?? '/',
    });

    return json({ user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return json({ error: 'Email already in use' }, { status: 409 });
    }
    return json({ error: 'Failed to sign up' }, { status: 500 });
  }
};
