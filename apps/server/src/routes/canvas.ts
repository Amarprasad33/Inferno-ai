// apps/server/src/routes/canvas.ts
import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { prisma } from '../lib/prisma';
import { auth } from '../auth';

type AppVars = {
    Variables: {
        user: typeof auth.$Infer.Session.user | null,
        session: typeof auth.$Infer.Session.session | null
    }
};

const requireAuth: MiddlewareHandler<AppVars> = async (c, next) => {
    const user = c.get('user');
    if (!user) return c.body(null, 401);
    return next();
};

export const canvas = new Hono<AppVars>();

// Create a canvas for the current user
canvas.post('/', requireAuth, async (c) => {
    const user = c.get('user')!;
    const { title } = await c.req.json().catch(() => ({} as any));
    const rec = await prisma.canvas.create({
        data: { ownerId: user.id, title: (title ?? 'Untitled Canvas').slice(0, 200) },
        select: { id: true, title: true, createdAt: true },
    });
    return c.json(rec, 201);
});

// Create a node on a canvas (owned by user)
canvas.post('/:id/nodes', requireAuth, async (c) => {
    const user = c.get('user')!;
    const canvasId = c.req.param('id');
    const body = await c.req.json().catch(() => null) as { label?: string; provider?: string; model?: string } | null;
    if (!body?.provider || !body?.model) {
        return c.json({ error: 'provider and model required' }, 400);
    }

    const can = await prisma.canvas.findFirst({ where: { id: canvasId, ownerId: user.id }, select: { id: true } });
    if (!can) return c.body(null, 404);

    const node = await prisma.node.create({
        data: {
            canvasId,
            label: (body.label ?? 'Chat').slice(0, 200),
            provider: body.provider,
            model: body.model,
        },
        select: { id: true, label: true, provider: true, model: true, createdAt: true },
    });

    return c.json(node, 201);
});