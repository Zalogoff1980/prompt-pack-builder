import { GenerateRequest, Prompt, RecommendedSettings } from "@/lib/types";
import { AIProvider } from "@/lib/ai/provider";

function uid(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface RawPrompt {
  title: string;
  prompt: string;
  negativePrompt?: string;
  variables?: string[];
  recommendedSettings?: RecommendedSettings;
  tags?: string[];
}

/**
 * OpenAIProvider calls the real OpenAI Chat Completions API and asks
 * for a strict JSON array of prompt objects. It is only instantiated
 * when OPENAI_API_KEY is present — see lib/ai/index.ts.
 */
export class OpenAIProvider implements AIProvider {
  readonly id = "openai";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async generatePacks(request: GenerateRequest): Promise<Prompt[]> {
    const count = request.regenerateTitle ? 1 : request.count;
    const system = `You are a prompt engineer generating structured AI prompt packs for a commercial prompt-pack product. Respond with ONLY a JSON array (no prose, no markdown fences). Each array item must be an object with exactly these fields: title (short uppercase scene name), prompt (the full prompt text, including bracketed placeholder variables like [SUBJECT]), negativePrompt (string), variables (array of the bracketed variable names used, without brackets), recommendedSettings (object of short key/value strings relevant to the content type and model), tags (array of 3-5 short strings).`;
    const user = `Content type: ${request.contentType}\nModel: ${request.model}\nCategory: ${request.category}\nStyle: ${request.style}\nCount: ${count}\nAdditional instructions: ${request.instructions || "none"}${
      request.regenerateTitle ? `\nThis is a single regeneration replacing a prompt previously titled "${request.regenerateTitle}" — produce a fresh, different take.` : ""
    }`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.9,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI request failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "[]";
    const cleaned = content.replace(/```json|```/g, "").trim();

    let raw: RawPrompt[];
    try {
      raw = JSON.parse(cleaned);
    } catch {
      throw new Error("OpenAI returned a response that could not be parsed as JSON.");
    }

    return raw.map((item) => ({
      id: uid(),
      title: (item.title || "UNTITLED").toUpperCase(),
      prompt: item.prompt || "",
      negativePrompt: item.negativePrompt || "",
      variables: item.variables || [],
      recommendedSettings: item.recommendedSettings || {},
      model: request.model,
      category: request.category,
      tags: item.tags || [request.category, request.style, request.model],
      createdAt: new Date().toISOString(),
    }));
  }
}
