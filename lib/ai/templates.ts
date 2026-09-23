import { AIModelId, ContentType, Prompt, RecommendedSettings } from "@/lib/types";

interface SceneConcept {
  name: string;
  focus: string;
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const NEGATIVE_VISUAL =
  "blurry, low resolution, distorted proportions, extra limbs, warped geometry, watermark, text artifacts, oversaturated colors, inconsistent lighting, compression noise";

const IMAGE_SCENES: SceneConcept[] = [
  { name: "Hero Shot", focus: "front-facing hero composition with the subject centered and perfectly lit" },
  { name: "Macro Detail", focus: "extreme close-up revealing texture, material and fine surface detail" },
  { name: "Floating Composition", focus: "the subject levitating weightlessly against a smooth gradient backdrop" },
  { name: "Reflective Surface", focus: "placed on a glossy reflective surface with sharp mirrored highlights" },
  { name: "Natural Light", focus: "soft natural window light with long gentle shadows and warm tones" },
  { name: "Dark Moody Studio", focus: "low-key studio lighting with deep shadows and a single rim light" },
  { name: "Minimal Podium", focus: "resting on a minimal geometric podium against a seamless background" },
  { name: "Lifestyle Context", focus: "in a real-world lifestyle setting that tells a story around the subject" },
  { name: "Color Gel Lighting", focus: "bold colored gel lighting creating vibrant complementary highlights" },
  { name: "Texture & Material", focus: "emphasizing surface material, texture and craftsmanship in fine detail" },
  { name: "Symmetry Study", focus: "perfectly symmetrical framing with balanced negative space" },
  { name: "High Contrast Edit", focus: "high-contrast graphic treatment with crisp graphic shadows" },
];

const VIDEO_SCENES: SceneConcept[] = [
  { name: "Hero Reveal", focus: "a slow push-in reveal that builds anticipation before the subject fills the frame" },
  { name: "Macro Detail", focus: "an extreme close-up dolly move across texture and fine surface detail" },
  { name: "Rotating Turntable", focus: "a smooth 360-degree turntable rotation under even studio light" },
  { name: "Luxury Tabletop", focus: "resting on a marble or dark wood surface with a slow orbiting camera" },
  { name: "Floating Sequence", focus: "the subject floating and gently rotating against a soft gradient backdrop" },
  { name: "Liquid Environment", focus: "a dynamic splash or liquid interaction frozen and then flowing in slow motion" },
  { name: "Dark Studio", focus: "moody low-key studio lighting with a single dramatic rim light and slow drift" },
  { name: "Futuristic Showroom", focus: "a sci-fi retail showroom with ambient neon light and a glide-through camera move" },
  { name: "Slow Motion Reveal", focus: "a dramatic slow-motion reveal timed to a rhythmic beat" },
  { name: "Dynamic Camera Move", focus: "a sweeping crane or gimbal move that circles the subject with energy" },
  { name: "Natural Light Lifestyle", focus: "handheld natural-light footage set in an everyday lifestyle moment" },
  { name: "Color Gel Lighting", focus: "vibrant complementary gel lighting pulsing in time with a subtle camera drift" },
  { name: "Smoke & Fog Atmosphere", focus: "thin atmospheric fog catching directional light as the camera glides past" },
  { name: "Glass Reflection", focus: "reflections across a glass surface as the camera tracks laterally" },
  { name: "Minimalist Podium", focus: "a clean geometric podium under a single spotlight with a slow arc move" },
  { name: "Urban Street Context", focus: "an urban street backdrop with shallow depth of field and gentle parallax" },
  { name: "Seasonal Theme", focus: "seasonal set dressing and light that shifts mood across the shot" },
  { name: "Unboxing Moment", focus: "a tactile unboxing sequence shot in crisp top-down macro detail" },
  { name: "Material Burst", focus: "raw ingredient or material elements bursting into frame around the subject" },
  { name: "Logo Reveal", focus: "a closing beat where light resolves into a clean brand mark reveal" },
];

const MUSIC_SCENES: SceneConcept[] = [
  { name: "Intro Build", focus: "a minimal intro that gradually layers instrumentation toward the first drop" },
  { name: "Main Groove", focus: "a steady main groove establishing the core rhythmic identity of the track" },
  { name: "Melodic Hook", focus: "a memorable melodic hook carried by a lead instrument or vocal motif" },
  { name: "Breakdown", focus: "a stripped-back breakdown that isolates one or two elements for tension" },
  { name: "Energy Peak", focus: "the highest-energy section with full arrangement and driving rhythm" },
  { name: "Ambient Interlude", focus: "an atmospheric interlude with sustained pads and minimal percussion" },
  { name: "Outro Fade", focus: "a gradual outro that unwinds the arrangement back to silence" },
  { name: "Cinematic Swell", focus: "an orchestral swell building tension toward a climactic hit" },
];

const TEXT_SCENES: SceneConcept[] = [
  { name: "Attention Hook", focus: "an opening line built to stop the scroll and earn the next sentence" },
  { name: "Problem Framing", focus: "a short framing of the problem the audience recognizes in themselves" },
  { name: "Value Proposition", focus: "a clear statement of the core benefit in plain, specific language" },
  { name: "Social Proof Angle", focus: "a angle that leans on credibility, results or third-party validation" },
  { name: "Objection Handling", focus: "copy that names and defuses the audience's most likely hesitation" },
  { name: "Call To Action", focus: "a closing line that tells the reader exactly what to do next" },
  { name: "Story Opener", focus: "a narrative opening that puts the reader inside a specific moment" },
  { name: "Comparison Angle", focus: "copy that positions the offer clearly against the obvious alternative" },
];

const SCENE_BANK: Record<ContentType, SceneConcept[]> = {
  image: IMAGE_SCENES,
  video: VIDEO_SCENES,
  music: MUSIC_SCENES,
  text: TEXT_SCENES,
};

const VARIABLES_BY_TYPE: Record<ContentType, string[]> = {
  image: ["SUBJECT", "COLOR", "ENVIRONMENT", "MOOD", "CAMERA"],
  video: ["SUBJECT", "COLOR", "ENVIRONMENT", "MOOD", "CAMERA"],
  music: ["GENRE", "MOOD", "INSTRUMENT", "TEMPO"],
  text: ["AUDIENCE", "TONE", "TOPIC", "CTA"],
};

function settingsFor(type: ContentType, style: string, model: AIModelId): RecommendedSettings {
  switch (type) {
    case "image":
      return { resolution: "2048x2048", aspectRatio: "1:1 / 4:5", renderStyle: style, model };
    case "video":
      return { duration: "5–10s", cameraMotion: "slow, controlled movement", resolution: "1080p", fps: "24fps", model };
    case "music":
      return { tempo: "100–120 BPM", duration: "30–60s", key: "C minor", model };
    case "text":
      return { tone: style, length: "150–250 words", format: "long-form", model };
  }
}

function buildPromptText(type: ContentType, concept: SceneConcept, category: string, style: string, model: string, subjectVar = "SUBJECT"): string {
  const styleLower = style.toLowerCase();
  const categoryLower = category.toLowerCase();
  switch (type) {
    case "image":
      return `[${subjectVar}] — ${concept.focus}. Environment: [ENVIRONMENT]. Palette dominated by [COLOR] tones, ${styleLower} mood ([MOOD]). Composed for ${categoryLower} use, optimized for ${model}. Camera: [CAMERA].`;
    case "video":
      return `[${subjectVar}] — ${concept.focus}. Environment: [ENVIRONMENT]. Palette dominated by [COLOR] tones, ${styleLower} mood ([MOOD]). Shot for ${categoryLower} use, optimized for ${model}. Camera: [CAMERA].`;
    case "music":
      return `[GENRE] track, ${concept.focus}. Mood: [MOOD]. Lead instrumentation: [INSTRUMENT]. Tempo: [TEMPO]. Arranged in a ${styleLower} style for ${categoryLower} use, optimized for ${model}.`;
    case "text":
      return `Audience: [AUDIENCE]. ${concept.focus}, written in a [TONE] voice about [TOPIC]. Close with: [CTA]. Written in a ${styleLower} register for ${categoryLower} use, optimized for ${model}.`;
  }
}

function buildNegative(type: ContentType): string {
  if (type === "image" || type === "video") return NEGATIVE_VISUAL;
  if (type === "music") return "clipping, off-beat timing, muddy mix, unbalanced frequencies";
  return "vague claims, generic filler, jargon, passive voice, no clear next step";
}

export function generateTemplatePrompts(params: {
  contentType: ContentType;
  model: AIModelId;
  category: string;
  style: string;
  count: number;
}): Prompt[] {
  const { contentType, model, category, style, count } = params;
  const scenes = SCENE_BANK[contentType];
  const prompts: Prompt[] = [];
  for (let i = 0; i < count; i++) {
    const concept = scenes[i % scenes.length];
    const cycle = Math.floor(i / scenes.length);
    const title = cycle === 0 ? concept.name.toUpperCase() : `${concept.name.toUpperCase()} ${cycle + 1}`;
    prompts.push({
      id: uid(),
      title,
      prompt: buildPromptText(contentType, concept, category, style, model),
      negativePrompt: buildNegative(contentType),
      variables: VARIABLES_BY_TYPE[contentType],
      recommendedSettings: settingsFor(contentType, style, model),
      model,
      category,
      tags: [category, style, model, contentType],
      createdAt: new Date().toISOString(),
    });
  }
  return prompts;
}

export function regenerateSingleTemplatePrompt(params: {
  contentType: ContentType;
  model: AIModelId;
  category: string;
  style: string;
  previousTitle: string;
  previousVariables?: string[];
}): Prompt {
  const { contentType, model, category, style, previousTitle, previousVariables } = params;
  const scenes = SCENE_BANK[contentType];
  const baseName = previousTitle.replace(/\s\d+$/, "");
  const match = scenes.find((s) => s.name.toUpperCase() === baseName.toUpperCase());
  // pick a different concept than the previous one for a genuinely fresh regeneration
  const pool = scenes.filter((s) => s.name.toUpperCase() !== baseName.toUpperCase());
  const concept = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : match ?? scenes[0];
  // Preserve the pack's own variable convention (e.g. a seeded pack using
  // [PRODUCT] instead of the generic [SUBJECT]) rather than always
  // reverting to the generic set — keeps a regenerated card's variable
  // chips consistent with the text actually embedded in its prompt.
  const variables = previousVariables && previousVariables.length > 0 ? previousVariables : VARIABLES_BY_TYPE[contentType];
  const subjectVar = (type: ContentType) => (type === "image" || type === "video") && variables.length > 0 ? variables[0] : "SUBJECT";
  return {
    id: uid(),
    title: concept.name.toUpperCase(),
    prompt: buildPromptText(contentType, concept, category, style, model, subjectVar(contentType)),
    negativePrompt: buildNegative(contentType),
    variables,
    recommendedSettings: settingsFor(contentType, style, model),
    model,
    category,
    tags: [category, style, model, contentType],
    createdAt: new Date().toISOString(),
  };
}

// --- Fixed seed pack: "Cinematic AI Product Ads" (Kling, Product Advertising, 20 prompts) ---

const DEMO_PACK_SCENES: { title: string; focus: string }[] = [
  { title: "Hero Product", focus: "a commanding hero composition, [PRODUCT] centered and perfectly lit against a soft gradient" },
  { title: "Macro Detail", focus: "an extreme macro dolly across [PRODUCT]'s surface, revealing material and craftsmanship" },
  { title: "Rotating Product", focus: "a clean 360-degree turntable rotation of [PRODUCT] under even studio light" },
  { title: "Luxury Tabletop", focus: "[PRODUCT] resting on dark marble with a slow orbiting camera and warm key light" },
  { title: "Floating Product", focus: "[PRODUCT] floating above a black reflective surface, rotating gently in still air" },
  { title: "Liquid Environment", focus: "[PRODUCT] emerging from a splash of liquid, droplets suspended in slow motion" },
  { title: "Dark Studio", focus: "[PRODUCT] lit by a single dramatic rim light against a near-black backdrop" },
  { title: "Futuristic Showroom", focus: "[PRODUCT] displayed in a sci-fi showroom with ambient neon and a glide-through camera" },
  { title: "Slow Motion", focus: "a dramatic slow-motion reveal of [PRODUCT] timed to a rhythmic beat drop" },
  { title: "Dynamic Camera", focus: "a sweeping gimbal move circling [PRODUCT] with high energy and momentum" },
  { title: "Natural Light Lifestyle", focus: "[PRODUCT] used in a sunlit, everyday lifestyle moment, handheld and candid" },
  { title: "Color Gel Lighting", focus: "[PRODUCT] under pulsing complementary gel lighting with a subtle camera drift" },
  { title: "Smoke & Fog Atmosphere", focus: "thin atmospheric fog drifting past [PRODUCT] as the camera glides laterally" },
  { title: "Glass Reflection", focus: "[PRODUCT] reflected across a wet glass surface as the camera tracks sideways" },
  { title: "Minimalist Podium", focus: "[PRODUCT] on a clean geometric podium under a single spotlight, slow arc move" },
  { title: "Urban Street Context", focus: "[PRODUCT] set against an urban backdrop with shallow depth of field" },
  { title: "Seasonal Theme", focus: "[PRODUCT] styled with seasonal set dressing, light shifting mood across the shot" },
  { title: "Unboxing Moment", focus: "a tactile top-down unboxing sequence revealing [PRODUCT] in crisp macro detail" },
  { title: "Ingredient Burst", focus: "raw material elements bursting into frame and settling around [PRODUCT]" },
  { title: "Brand Logo Reveal", focus: "a closing beat where light resolves into [BRAND]'s clean logo mark" },
];

export function buildDemoProductAdsPack(): Prompt[] {
  return DEMO_PACK_SCENES.map((scene) => ({
    id: uid(),
    title: scene.title.toUpperCase(),
    prompt: `${scene.focus}. Color palette: [COLOR]. Environment: [ENVIRONMENT]. Mood: [MOOD]. Camera: [CAMERA]. Optimized for Kling, cinematic product-advertising grade.`,
    negativePrompt: NEGATIVE_VISUAL,
    variables: ["PRODUCT", "BRAND", "COLOR", "ENVIRONMENT", "CAMERA", "MOOD"],
    recommendedSettings: { duration: "5–10s", cameraMotion: "slow, controlled movement", resolution: "1080p", fps: "24fps", model: "kling" },
    model: "kling",
    category: "Product Advertising",
    tags: ["Product Advertising", "Cinematic", "kling", "video"],
    createdAt: new Date().toISOString(),
  }));
}

// --- Product packaging copy suggestions (template-based) ---

export function suggestProductCopy(params: {
  packName: string;
  category: string;
  model: AIModelId;
  promptCount: number;
  style: string;
}): { productName: string; subtitle: string; description: string; salesCopy: string; whatsInside: string[]; tags: string[] } {
  const { packName, category, model, promptCount, style } = params;
  const productName = packName || `${style} ${category} Pack`;
  const subtitle = `${promptCount} professional prompts for ${model}`;
  const description = `Create ${style.toLowerCase()} ${category.toLowerCase()} content with a structured, ready-to-use prompt set. Every prompt is built with reusable variables, negative prompts and recommended settings so you can start producing consistent, on-brand results immediately.`;
  const salesCopy = `Stop starting from a blank prompt box. This pack gives you ${promptCount} field-tested prompts for ${model}, organized around a clear creative system — so every output stays consistent, on-brand and production-ready.`;
  const whatsInside = [
    `${promptCount} prompts`,
    "Negative prompts",
    "Reusable variables",
    "Recommended settings",
    "Category & style tags",
    "JSON, Markdown, TXT and PDF export",
  ];
  return { productName, subtitle, description, salesCopy, whatsInside, tags: [category, style, model] };
}
