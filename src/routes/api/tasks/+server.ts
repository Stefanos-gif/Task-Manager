// src/routes/api/tasks/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; // nicer types than '@sveltejs/kit'
import { prisma } from '$lib/db';

// GET /api/tasks?done=true|false  (only my tasks)
export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

  const doneParam = url.searchParams.get('done');
  const where: { userId: string; done?: boolean } = { userId: locals.user.id };

  if (doneParam !== null) {
    if (doneParam !== 'true' && doneParam !== 'false') {
      return json({ error: 'done has to be either true or false' }, { status: 400 });
    }
    where.done = doneParam === 'true';
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return json({ tasks }, { status: 200 });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'INVALID JSON' }, { status: 400 });
  }
  if (typeof raw !== 'object' || raw === null) {
    return json({ error: 'body MUST be an object' }, { status: 400 });
  }

  const { title, notes } = raw as Record<string, unknown>;

  if (typeof title !== 'string') {
    return json({ error: 'title must be string' }, { status: 400 });
  }

  const t = title.trim();
  if (t.length < 1 || t.length > 80) {
    return json({ error: 'title must be 1-80 characters long' }, { status: 422 });
  }
  if (notes !== undefined && typeof notes !== 'string') {
    return json({ error: 'notes must be a string if provided' }, { status: 422 });
  }

  const created = await prisma.task.create({
    data: {
      title: t,
      notes: notes ? String(notes).trim() : undefined,
      // EITHER of these is fine; pick one:
      userId: locals.user.id,               // direct FK
      // user: { connect: { id: locals.user.id } }, // via relation
    }
  });

  return json(created, { status: 201 });
};
