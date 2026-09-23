import { GenerateRequest, Prompt } from "@/lib/types";

/**
 * AIProvider is the abstraction every generation backend implements.
 * Add a new provider (Claude, Gemini, OpenRouter, a local model) by
 * creating a class that satisfies this interface and wiring it into
 * lib/ai/index.ts — no other application code needs to change.
 */
export interface AIProvider {
  readonly id: string;
  readonly isConfigured: boolean;
  generatePacks(request: GenerateRequest): Promise<Prompt[]>;
}
