import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client';
import { users, apiKeys } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import argon2 from 'argon2';
import { signJwt } from '../auth';
import { encryptSecret } from '../crypto';

export const auth = new Hono();

auth.post('/register',
  zValidator('json', z.object({ email: z.string().email(), password: z.string().min(8) })),
  async c => {
    const { email, password } = c.req.valid('json');
    const hash = await argon2.hash(password);
    try {
      const [u] = await db.insert(users).values({ email, passwordHash: hash }).returning();
      const token = signJwt({ userId: u.id });
      c.header('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
      return c.json({ userId: u.id });
    } catch {
      return c.json({ error: 'email_taken' }, 409);
    }
  }
);

auth.post('/login',
  zValidator('json', z.object({ email: z.string().email(), password: z.string().min(8) })),
  async c => {
    const { email, password } = c.req.valid('json');
    const [u] = await db.select().from(users).where(eq(users.email, email));
    if (!u || !u.passwordHash || !(await argon2.verify(u.passwordHash, password))) {
      return c.json({ error: 'invalid_credentials' }, 401);
    }
    const token = signJwt({ userId: u.id });
    c.header('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
    return c.json({ userId: u.id });
  }
);

auth.post('/keys',
  zValidator('json', z.object({ provider: z.enum(['openai', 'anthropic']), secret: z.string().min(10) })),
  async c => {
    const userId = c.get('userId') as string;
    const { provider, secret } = c.req.valid('json');
    const { encrypted, iv } = encryptSecret(secret);
    await db.insert(apiKeys).values({ userId, provider, encryptedSecret: encrypted, iv }).onConflictDoUpdate({
      target: [apiKeys.userId, apiKeys.provider],
      set: { encryptedSecret: encrypted, iv }
    });
    return c.json({ ok: true });
  }
);