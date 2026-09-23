import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { DemoProvider } from "@/lib/ai/demo-provider";
import { generateTemplatePrompts, regenerateSingleTemplatePrompt } from "@/lib/ai/templates";
import { GenerateRequest, GenerateResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.contentType || !body.model || !body.category || !body.style) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const provider = getAIProvider();
  const demoMode = provider.id === "demo";

  try {
    const prompts = await provider.generatePacks(body);
    const response: GenerateResponse = { prompts, demoMode };
    return NextResponse.json(response);
  } catch (err) {
    // If a real provider fails at runtime (bad key, network issue, rate
    // limit), fall back to demo generation rather than breaking the
    // workflow — the UI will still show DEMO MODE for this response.
    console.error("Generation provider failed, falling back to demo mode:", err);
    const fallback = new DemoProvider();
    const prompts = body.regenerateTitle
      ? [regenerateSingleTemplatePrompt({ contentType: body.contentType, model: body.model, category: body.category, style: body.style, previousTitle: body.regenerateTitle, previousVariables: body.regenerateVariables })]
      : generateTemplatePrompts({ contentType: body.contentType, model: body.model, category: body.category, style: body.style, count: body.count });
    const response: GenerateResponse = { prompts, demoMode: true };
    return NextResponse.json(response);
  }
}
