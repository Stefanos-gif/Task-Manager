import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';
import { lucia } from '$lib/auth/lucia';
import { Argon2id } from 'oslo/password';

export const POST: RequestHandler = async ({ request, cookies }) => {
  let raw: unknown;
  try { raw = await request.json(); } catch { return json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (typeof raw !== 'object' || raw === null) return json({ error: 'Body must be an object' }, { status: 400 });

  const { email, password } = raw as Record<string, unknown>;
  if (typeof email !== 'string' || typeof password !== 'string') return json({ error: 'Email and password are required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await new Argon2id().verify(user.passwordHash, password);
  if (!ok) return json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await lucia.createSession(user.id, {});
  const cookie = lucia.createSessionCookie(session.id);
  cookies.set(cookie.name, cookie.value, { ...cookie.attributes, path: cookie.attributes.path ?? '/' });

  return json({ user: { id: user.id, email: user.email } }, { status: 200 });
};
