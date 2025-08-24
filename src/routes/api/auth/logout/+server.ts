import type { RequestHandler } from './$types';
import { lucia } from '$lib/auth/lucia';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (locals.session) await lucia.invalidateSession(locals.session.id);
  const blank = lucia.createBlankSessionCookie();
  cookies.set(blank.name, blank.value, { ...blank.attributes, path: blank.attributes.path ?? '/' });
  return new Response(null, { status: 204 });
};
