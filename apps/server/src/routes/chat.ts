import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client';
import { nodes, apiKeys, messages } from '../db/schema';
import { eq } from 'drizzle-orm';
import { decryptSecret } from '../crypto';
import { getStream } from '../ai/providers';

export const chat = new Hono();

chat.post('/stream',
  zValidator('json', z.object({
    nodeId: z.string().uuid(),
    messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })).min(1)
  })),
  async c => {
    const userId = c.get('userId') as string;
    const { nodeId, messages: msgs } = c.req.valid('json');

    const [node] = await db.select().from(nodes).where(eq(nodes.id, nodeId));
    if (!node) return c.json({ error: 'node_not_found' }, 404);

    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).where(eq(apiKeys.provider, node.provider));
    if (!key) return c.json({ error: 'missing_api_key' }, 400);

    const secret = decryptSecret(key.encryptedSecret, key.iv);

    const stream = await getStream(node.provider, node.model, secret, msgs);

    // persist user message quickly (fire-and-forget)
    void db.insert(messages).values({ nodeId, role: 'user', content: msgs.at(-1)!.content });

    return stream.toDataStreamResponse(); // SSE streaming response
  }
);