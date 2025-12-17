import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { prisma } from '../lib/prisma';
import { decryptSecret } from '../lib/crypto';
import { auth } from '../auth';

// AI SDK
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';

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
	provider?: 'openai' | 'groq'; // extend as you add more providers
	model: string;
	messages: ChatMessage[];
	// optional: temperature, maxTokens, etc.
	temperature?: number;
	maxTokens?: number;
	providerOptions?: Record<string, any>;
};

chat.post('/', requireAuth, async (c) => {
	const user = c.get('user')!;
	const body = await c.req.json().catch(() => null) as ChatBody | null;
	console.log("body--", body);
	if (!body?.model || !Array.isArray(body.messages)) {
		return c.json({ error: 'model and messages required' }, 400);
	}
	const provider = body.provider ?? 'openai';

	// Load user's API key for provider
	const keyRow = await prisma.apiKey.findUnique({
		where: { userId_provider: { userId: user.id, provider } }
	});

	let apiKey: string | undefined;

	if (keyRow) {
		try {
			apiKey = decryptSecret(keyRow.encryptedSecret, keyRow.iv);
		} catch {
			return c.json({ error: 'Stored API key cannot be decrypted. Please re-add your key.' }, 500);
		}
	} else {
		// Fallback to env vars
		if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY;
		else if (provider === 'groq') apiKey = process.env.GROQ_API_KEY;

		if (!apiKey) {
			return c.json({ error: `No API key stored for provider "${provider}"` }, 400);
		}
	}

	// Build provider client
	let modelFactory: (id: string) => any;
	switch (provider) {
		case 'openai':
			modelFactory = createOpenAI({ apiKey });
			break;
		case 'groq':
			modelFactory = createGroq({ apiKey });
			break;
		default:
			return c.json({ error: `Unsupported provider "${provider}"` }, 400);
	}

	const result = streamText({
		model: modelFactory(body.model),
		messages: body.messages,
		temperature: body.temperature,
		// maxTokens: body.maxTokens   // not supported in this version
		// maxTokens: body.maxTokens
		providerOptions: body.providerOptions
	});

	// Stream as SSE (works with Hono)
	return result.toTextStreamResponse();
});