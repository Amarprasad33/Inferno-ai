export type AIProvider = "openai" | "groq" | "anthropic"; // extend as needed

export type AIModel = {
  id: string; // e.g., "llama-3.3-70b-versatile"
  name: string; // Display name
  provider: AIProvider;
  description?: string;
  maxTokens?: number;
  available?: boolean; // For feature flags
};

export const AI_MODELS: Record<AIProvider, AIModel[]> = {
  groq: [
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3 70B Versatile",
      provider: "groq",
      description: "Fast and versatile model",
    },
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B Instant",
      provider: "groq",
    },
    // Add more...
  ],
  openai: [
    {
      id: "gpt-4o",
      name: "GPT-4o",
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
