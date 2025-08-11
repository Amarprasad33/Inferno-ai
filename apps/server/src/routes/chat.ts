// import { Hono } from 'hono';
// import { z } from 'zod';
// import { zValidator } from '@hono/zod-validator';
// import { prisma } from '../db/client';
// import { getStream } from '../ai/providers';

// export const chat = new Hono();

// chat.post('/stream',
//   zValidator('json', z.object({
//     nodeId: z.string().uuid(),
//     messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })).min(1)
//   })),
//   async c => {
//     const userId = c.get('userId') as string;
//     const { nodeId, messages } = c.req.valid('json');

//     const node = await prisma.node.findUnique({ where: { id: nodeId } });
//     if (!node) return c.json({ error: 'node_not_found' }, 404);

//     const key = await prisma.apiKey.findUnique({
//       where: { userId_provider: { userId, provider: node.provider } }
//     });
//     if (!key) return c.json({ error: 'missing_api_key' }, 400);

//     // If you need to read secrets, add decryptSecret here like before.
//     // const secret = decryptSecret(key.encryptedSecret, key.iv);

//     const stream = await getStream(node.provider, node.model, /* secret */ '', messages);

//     void prisma.message.create({ data: { nodeId, role: 'user', content: messages.at(-1)!.content } });

//     return stream.toDataStreamResponse();
//   }
// );