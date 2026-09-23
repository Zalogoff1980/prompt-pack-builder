import { AIProvider } from "@/lib/ai/provider";
import { DemoProvider } from "@/lib/ai/demo-provider";
import { OpenAIProvider } from "@/lib/ai/openai-provider";

export function getAIProvider(): AIProvider {
  const key = process.env.OPENAI_API_KEY;
  if (key && key.trim().length > 0) {
    return new OpenAIProvider(key, process.env.OPENAI_MODEL || "gpt-4o-mini");
  }
  return new DemoProvider();
}

export { type AIProvider } from "@/lib/ai/provider";
