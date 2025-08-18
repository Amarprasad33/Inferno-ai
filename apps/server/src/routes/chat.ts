import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { prisma } from '../lib/prisma';
import { decryptSecret } from '../lib/crypto';
import { auth } from '../auth';

// AI SDK
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

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

export const chat = new Hono<AppVars>();

type ChatMessage = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

type ChatBody = {
	provider?: 'openai'; // extend as you add more providers
	model: string;
	messages: ChatMessage[];
	// optional: temperature, maxTokens, etc.
	temperature?: number;
	maxTokens?: number;
};

chat.post('/', requireAuth, async (c) => {
	const user = c.get('user')!;
	const body = await c.req.json().catch(() => null) as ChatBody | null;
	if (!body?.model || !Array.isArray(body.messages)) {
		return c.json({ error: 'model and messages required' }, 400);
	}
	const provider = body.provider ?? 'openai';

	// Load user's API key for provider
	const keyRow = await prisma.apiKey.findUnique({
		where: { userId_provider: { userId: user.id, provider } }
	});
	if (!keyRow) return c.json({ error: `No API key stored for provider "${provider}"` }, 400);

	const apiKey = decryptSecret(keyRow.encryptedSecret, keyRow.iv);

	// Build provider client
	let modelFactory: ReturnType<typeof createOpenAI> | null = null;
	switch (provider) {
		case 'openai':
			modelFactory = createOpenAI({ apiKey });
			break;
		default:
			return c.json({ error: `Unsupported provider "${provider}"` }, 400);
	}

	const result = streamText({
		model: modelFactory(body.model),
		messages: body.messages,
		temperature: body.temperature,
		// maxTokens: body.maxTokens   // not supported in this version
	});

	// Stream as SSE (works with Hono)
	return result.toTextStreamResponse();
});