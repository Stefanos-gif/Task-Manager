import type { Handle } from '@sveltejs/kit';
import { lucia } from '$lib/auth/lucia';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const c = lucia.createSessionCookie(session.id);
    event.cookies.set(c.name, c.value, { ...c.attributes, path: c.attributes.path ?? '/' });
  }
  if (!session) {
    const b = lucia.createBlankSessionCookie();
    event.cookies.set(b.name, b.value, { ...b.attributes, path: b.attributes.path ?? '/' });
  }

  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};
