import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { prisma } from "../lib/prisma";
import { decryptSecret } from "../lib/crypto";
import { auth } from "../auth";
import { aggregateContextWithUserMessage } from "../lib/context-service";

// AI SDK
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";

type AppVars = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const requireAuth: MiddlewareHandler<AppVars> = async (c, next) => {
  const user = c.get("user");
  if (!user) return c.body(null, 401);
  return next();
};

export const chat = new Hono<AppVars>();

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatBody = {
  provider?: "openai" | "groq"; // extend as you add more providers
  model: string;
  messages?: ChatMessage[]; // Optional if using contextChain
  // Context chain support
  currentNodeId?: string;
  contextChainIds?: string[]; // Ordered list of upstream node IDs
  userMessage?: string; // Direct user message text
  // optional: temperature, maxTokens, etc.
  temperature?: number;
  maxTokens?: number;
  providerOptions?: Record<string, any>;
};

chat.post("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = (await c.req.json().catch(() => null)) as ChatBody | null;
  console.log("body--", body);

  if (!body?.model) {
    return c.json({ error: "model is required" }, 400);
  }

  // Validate that we have either messages or contextChain
  if (!body.messages && !body.contextChainIds) {
    return c.json(
      { error: "Either messages or contextChainIds must be provided" },
      400
    );
  }

  // If using context chain, validate userMessage is provided
  if (body.contextChainIds && !body.userMessage) {
    return c.json(
      { error: "userMessage is required when using contextChainIds" },
      400
    );
  }

  const provider = body.provider ?? "openai";

  // Determine the messages to send to AI
  let messagesToSend: ChatMessage[];

  if (body.contextChainIds && body.userMessage) {
    // Use context chain: aggregate messages from upstream nodes
    try {
      messagesToSend = await aggregateContextWithUserMessage(
        body.contextChainIds,
        body.userMessage,
        user.id
      );
    } catch (error) {
      console.error("Failed to aggregate context:", error);
      return c.json(
        { error: "Failed to aggregate context from upstream nodes" },
        500
      );
    }
  } else if (body.messages) {
    // Use provided messages directly (backward compatible)
    messagesToSend = body.messages;
  } else {
    return c.json({ error: "No messages or context chain provided" }, 400);
  }

  if (messagesToSend.length === 0) {
    return c.json({ error: "No messages to send" }, 400);
  }

  // Load user's API key for provider
  const keyRow = await prisma.apiKey.findUnique({
    where: { userId_provider: { userId: user.id, provider } },
  });
  //   console.log("keyRow", keyRow);

  let apiKey: string | undefined;

  if (keyRow) {
    try {
      apiKey = decryptSecret(keyRow.encryptedSecret, keyRow.iv);
    } catch {
      return c.json(
        {
          error: "Stored API key cannot be decrypted. Please re-add your key.",
        },
        500
      );
    }
  } else {
    return c.json(
      { error: `No API key stored for provider "${provider}"` },
      400
    );
  }
  // This for devleopment purpose - Omit this in prod
  // else {
  //   // Fallback to env vars
  //   console.log("Fallback-to-env - API keys");
  //   if (provider === "openai") apiKey = process.env.OPENAI_API_KEY;
  //   else if (provider === "groq") apiKey = process.env.GROQ_API_KEY;

  //   if (!apiKey) {
  //     return c.json(
  //       { error: `No API key stored for provider "${provider}"` },
  //       400
  //     );
  //   }
  // }
  console.log("provider----->>   ", provider);
  // Build provider client
  let modelFactory: (id: string) => any;
  switch (provider) {
    case "openai":
      modelFactory = createOpenAI({ apiKey });
      break;
    case "groq":
      modelFactory = createGroq({ apiKey });
      break;
    default:
      return c.json({ error: `Unsupported provider "${provider}"` }, 400);
  }
  console.log("messages--M", messagesToSend);
  const result = streamText({
    model: modelFactory(body.model),
    messages: messagesToSend,
    temperature: body.temperature,
    // maxTokens: body.maxTokens   // not supported in this version
    // maxTokens: body.maxTokens
    providerOptions: body.providerOptions,
  });

  // Stream as SSE (works with Hono)
  return result.toTextStreamResponse();
});
