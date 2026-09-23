export type ContentType = "image" | "video" | "music" | "text";

export type AIModelId =
  | "kling"
  | "veo"
  | "runway"
  | "midjourney"
  | "flux"
  | "gpt-image"
  | "suno"
  | "chatgpt";

export interface AIModelConfig {
  id: AIModelId;
  label: string;
  contentTypes: ContentType[];
  description: string;
}

export interface RecommendedSettings {
  [key: string]: string;
}

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  variables: string[];
  recommendedSettings: RecommendedSettings;
  model: AIModelId;
  category: string;
  tags: string[];
  createdAt: string;
}

export type PackStatus = "draft" | "product";

export interface PromptPackMetadata {
  instructions?: string;
  demoMode: boolean;
}

export interface PromptPack {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  model: AIModelId;
  category: string;
  style: string;
  prompts: Prompt[];
  metadata: PromptPackMetadata;
  status: PackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPackage {
  id: string;
  packId: string;
  productName: string;
  subtitle: string;
  description: string;
  author: string;
  salesCopy: string;
  whatsInside: string[];
  tags: string[];
  createdAt: string;
}

export interface GenerateRequest {
  contentType: ContentType;
  model: AIModelId;
  category: string;
  style: string;
  count: number;
  instructions?: string;
  regenerateTitle?: string;
  /** When regenerating a single prompt, the variables it previously used —
   *  passed through so demo regeneration keeps the pack's variable
   *  convention (e.g. [PRODUCT]/[BRAND]) instead of falling back to the
   *  generic set. */
  regenerateVariables?: string[];
}

export interface GenerateResponse {
  prompts: Prompt[];
  demoMode: boolean;
}

export const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "music", label: "Music" },
  { id: "text", label: "Text" },
];

export const AI_MODELS: AIModelConfig[] = [
  { id: "kling", label: "Kling", contentTypes: ["video"], description: "Cinematic video generation" },
  { id: "veo", label: "Veo", contentTypes: ["video"], description: "Google video generation" },
  { id: "runway", label: "Runway", contentTypes: ["video", "image"], description: "Video & motion design" },
  { id: "midjourney", label: "Midjourney", contentTypes: ["image"], description: "Stylized image generation" },
  { id: "flux", label: "Flux", contentTypes: ["image"], description: "High-fidelity image generation" },
  { id: "gpt-image", label: "GPT Image", contentTypes: ["image"], description: "OpenAI image generation" },
  { id: "suno", label: "Suno", contentTypes: ["music"], description: "AI music generation" },
  { id: "chatgpt", label: "ChatGPT", contentTypes: ["text"], description: "Text & copywriting" },
];

export const CATEGORIES: string[] = [
  "Product Advertising",
  "Cinematic",
  "Social Media",
  "Character",
  "Fashion",
  "Architecture",
  "Music",
  "YouTube",
  "Thumbnail",
  "Fantasy",
  "Sci-Fi",
];

export const STYLES: string[] = [
  "Cinematic",
  "Luxury",
  "Dark",
  "Minimal",
  "Futuristic",
  "Realistic",
  "Experimental",
];

export const PROMPT_COUNTS: number[] = [10, 20, 30, 50];

export function modelsForContentType(type: ContentType): AIModelConfig[] {
  return AI_MODELS.filter((m) => m.contentTypes.includes(type));
}
