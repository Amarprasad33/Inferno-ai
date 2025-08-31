import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { prisma } from "../lib/prisma";
import { encryptSecret } from "../lib/crypto";
import { auth } from "../auth";


type AppVars = {
    Variables: {
        user: typeof auth.$Infer.Session.user | null,
        session: typeof auth.$Infer.Session.session | null
    }
};

const allowedProviders = new Set(['openai', 'groq']);

const requireAuth: MiddlewareHandler<AppVars> = async (c, next) => {
    const user = c.get("user");
    console.log('auth--req=--', user);
    if (!user) return c.body(null, 401);
    return next();
};

export const keys = new Hono<AppVars>();

// Deleting API key for a provider
keys.delete("/:provider", requireAuth, async (c) => {
    const provider = c.req.param('provider');
    if (!allowedProviders.has(provider)) {
        return c.json({ error: 'invalid provider' }, 400);
    }
    const user = c.get('user')!;
    await prisma.apiKey.deleteMany({ where: { userId: user.id, provider } });


    console.log("Api-key deleted from db --<--D>");
    return c.body(null, 204);
})

// Upserting an API key for a provider
keys.post('/', requireAuth, async (c) => {
    const body = await c.req.json().catch(() => null) as { provider?: string; apiKey?: string } | null;
    console.log('adding keys--', body);
    if (!body?.provider || !body?.apiKey)
        return c.json({ error: 'provider and apiKey required' }, 400);

    if (!allowedProviders.has(body.provider)) {
        return c.json({ error: 'invalid provider' }, 400);
    }

    const user = c.get('user')!;
    const { encrypted, iv } = encryptSecret(body.apiKey);

    await prisma.apiKey.upsert({
        where: { userId_provider: { userId: user.id, provider: body.provider } },
        update: { encryptedSecret: encrypted, iv },
        create: {
            userId: user.id,
            provider: body.provider,
            encryptedSecret: encrypted,
            iv
        }
    });

    console.log("Api-key added in db --<>");
    return c.body(null, 204);
})

keys.get("/", requireAuth, async (c) => {
    console.log("get route hit-- keys");
    const user = c.get('user')!;
    console.log("user--", user);
    const rows = await prisma.apiKey.findMany({
        where: { userId: user.id },
        select: { provider: true }
    })
    console.log("rows", rows)

    return c.json({ providers: rows.map(r => r.provider) });
})
