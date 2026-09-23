import { GenerateRequest, Prompt } from "@/lib/types";
import { AIProvider } from "@/lib/ai/provider";
import { generateTemplatePrompts, regenerateSingleTemplatePrompt } from "@/lib/ai/templates";

/**
 * DemoProvider never makes a network call. It produces structured,
 * high-quality prompt packs from the local template bank so the full
 * Create → Generate → Edit → Package → Export workflow works with
 * zero configuration.
 */
export class DemoProvider implements AIProvider {
  readonly id = "demo";
  readonly isConfigured = true;

  async generatePacks(request: GenerateRequest): Promise<Prompt[]> {
    if (request.regenerateTitle) {
      return [
        regenerateSingleTemplatePrompt({
          contentType: request.contentType,
          model: request.model,
          category: request.category,
          style: request.style,
          previousTitle: request.regenerateTitle,
          previousVariables: request.regenerateVariables,
        }),
      ];
    }
    return generateTemplatePrompts({
      contentType: request.contentType,
      model: request.model,
      category: request.category,
      style: request.style,
      count: request.count,
    });
  }
}
