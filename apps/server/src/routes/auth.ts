// import { Hono } from 'hono';
// import { z } from 'zod';
// import { zValidator } from '@hono/zod-validator';
// import argon2 from 'argon2';
// import { prisma } from '../db/client';
// import { signJwt } from '../auth';
// import { encryptSecret } from '../crypto';

// export const auth = new Hono();

// auth.post('/register',
//   zValidator('json', z.object({ email: z.string().email(), password: z.string().min(8) })),
//   async c => {
//     const { email, password } = c.req.valid('json');
//     const hash = await argon2.hash(password);
//     try {
//       const user = await prisma.user.create({ data: { email, passwordHash: hash } });
//       const token = signJwt({ userId: user.id });
//       c.header('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
//       return c.json({ userId: user.id });
//     } catch {
//       return c.json({ error: 'email_taken' }, 409);
//     }
//   }
// );

// auth.post('/login',
//   zValidator('json', z.object({ email: z.string().email(), password: z.string().min(8) })),
//   async c => {
//     const { email, password } = c.req.valid('json');
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !user.passwordHash || !(await argon2.verify(user.passwordHash, password))) {
//       return c.json({ error: 'invalid_credentials' }, 401);
//     }
//     const token = signJwt({ userId: user.id });
//     c.header('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
//     return c.json({ userId: user.id });
//   }
// );

// auth.post('/keys',
//   zValidator('json', z.object({ provider: z.enum(['openai', 'anthropic']), secret: z.string().min(10) })),
//   async c => {
//     const userId = c.get('userId') as string;
//     const { provider, secret } = c.req.valid('json');
//     const { encrypted, iv } = encryptSecret(secret);
//     await prisma.apiKey.upsert({
//       where: { userId_provider: { userId, provider } },
//       update: { encryptedSecret: encrypted, iv },
//       create: { userId, provider, encryptedSecret: encrypted, iv }
//     });
//     return c.json({ ok: true });
//   }
// );