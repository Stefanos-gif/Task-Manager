import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/db";

export const GET:RequestHandler = async () => {
    const count = await prisma.task.count();
    return json({ ok: true, taskCount: count}, {status:200});
}