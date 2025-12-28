export type AIProvider = "openai" | "groq" | "anthropic"; // extend as needed

export type AIModel = {
  id: string;
  displayName: string; // Display displayName
  provider: AIProvider;
  subProvider?: string;
  description?: string;
  maxTokens?: number;
  available?: boolean; // For feature flags
};

export const AI_MODELS: Record<AIProvider, AIModel[]> = {
  groq: [
    {
      id: "groq/compound",
      displayName: "Compound",
      provider: "groq",
      subProvider: "Groq",
      description: "",
    },
    {
      id: "groq/compound-mini",
      displayName: "Compound Mini",
      provider: "groq",
      subProvider: "Groq",
      description: "",
    },
    {
      id: "llama-3.1-8b-instant",
      displayName: "Llama 3.1 8B",
      provider: "groq",
      subProvider: "Meta",
      description: "",
    },
    {
      id: "llama-3.3-70b-versatile",
      displayName: "Llama 3.3 70B",
      provider: "groq",
      subProvider: "Meta",
      description: "",
    },
    {
      id: "meta-llama/llama-guard-4-12b",
      displayName: "Llama Guard 4 12B",
      provider: "groq",
      subProvider: "Meta",
      description: "",
    },
    {
      id: "openai/gpt-oss-20b",
      displayName: "GPT OSS 20B",
      provider: "groq",
      subProvider: "OpenAI",
      description: "",
    },
    {
      id: "openai/gpt-oss-120b",
      displayName: "GPT OSS 120B",
      provider: "groq",
      subProvider: "OpenAI",
      description: "",
    },

    // Add more...
  ],
  openai: [
    {
      id: "gpt-4o",
      displayName: "GPT-4o",
      provider: "openai",
    },
    {
      id: "gpt-5.1",
      displayName: "GPT-5",
      provider: "openai",
    },
    // Add more...
  ],
  anthropic: [
    // Add when you support it
  ],
};

// Helper functions
export function getModelsByProvider(provider: AIProvider): AIModel[] {
  return AI_MODELS[provider] || [];
}

export function getAllProviders(): AIProvider[] {
  return Object.keys(AI_MODELS) as AIProvider[];
}

export function findModel(provider: AIProvider, modelId: string): AIModel | undefined {
  return AI_MODELS[provider]?.find((m) => m.id === modelId);
}
