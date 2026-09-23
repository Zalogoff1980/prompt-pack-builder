"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AIModelId,
  CATEGORIES,
  CONTENT_TYPES,
  ContentType,
  GenerateResponse,
  PROMPT_COUNTS,
  STYLES,
  modelsForContentType,
} from "@/lib/types";
import { newEmptyPack, savePack } from "@/lib/store";
import { useToast } from "@/components/Toast";

const PROGRESS_MESSAGES = ["Generating prompts…", "Structuring pack…", "Adding variables…", "Preparing your pack…"];

export default function CreatePackPage() {
  const router = useRouter();
  const { show } = useToast();

  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState<ContentType>("image");
  const [model, setModel] = useState<AIModelId | "">("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [count, setCount] = useState<number>(20);
  const [instructions, setInstructions] = useState("");

  const [generating, setGenerating] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [error, setError] = useState("");

  const availableModels = modelsForContentType(contentType);

  useEffect(() => {
    if (!availableModels.find((m) => m.id === model)) {
      setModel(availableModels[0]?.id ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]);

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setProgressIdx((i) => Math.min(i + 1, PROGRESS_MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, [generating]);

  const canProceed: Record<number, boolean> = {
    1: Boolean(contentType),
    2: Boolean(model),
    3: Boolean(category),
    4: Boolean(style),
    5: Boolean(count),
    6: true,
  };

  async function handleGenerate() {
    if (!model || !category || !style) return;
    setGenerating(true);
    setProgressIdx(0);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, model, category, style, count, instructions }),
      });
      if (!res.ok) throw new Error("Generation request failed.");
      const data: GenerateResponse = await res.json();

      const pack = newEmptyPack({ name: `${style} ${category} Pack`, contentType, model, category, style });
      pack.prompts = data.prompts;
      pack.metadata = { instructions, demoMode: data.demoMode };
      savePack(pack);
      show(data.demoMode ? "Pack generated in Demo Mode" : "Pack generated");
      router.push(`/packs/${pack.id}`);
    } catch {
      setError("Something went wrong while generating your pack. Please try again.");
      setGenerating(false);
    }
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="h-10 w-10 rounded-full border-2 border-graphite-700 border-t-cyan-accent animate-spin mb-6" />
        <p className="font-display text-lg text-graphite-100">{PROGRESS_MESSAGES[progressIdx]}</p>
        <p className="text-sm text-graphite-500 mt-2">Building {count} prompts for {model}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <h1 className="font-display text-2xl font-medium text-graphite-100 mb-1">Create New Pack</h1>
      <p className="text-sm text-graphite-500 mb-8">Step {step} of 6</p>

      <div className="h-1 rounded-full bg-graphite-800 mb-10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-accent to-violet-accent transition-all" style={{ width: `${(step / 6) * 100}%` }} />
      </div>

      {step === 1 && (
        <StepBlock title="Content type">
          <OptionGrid
            options={CONTENT_TYPES.map((c) => ({ id: c.id, label: c.label }))}
            selected={contentType}
            onSelect={(v) => setContentType(v as ContentType)}
          />
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="AI model">
          <OptionGrid
            options={availableModels.map((m) => ({ id: m.id, label: m.label, sub: m.description }))}
            selected={model}
            onSelect={(v) => setModel(v as AIModelId)}
          />
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="Category">
          <OptionGrid options={CATEGORIES.map((c) => ({ id: c, label: c }))} selected={category} onSelect={setCategory} columns={2} />
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock title="Style">
          <OptionGrid options={STYLES.map((s) => ({ id: s, label: s }))} selected={style} onSelect={setStyle} columns={2} />
        </StepBlock>
      )}

      {step === 5 && (
        <StepBlock title="Prompt count">
          <OptionGrid options={PROMPT_COUNTS.map((n) => ({ id: String(n), label: String(n) }))} selected={String(count)} onSelect={(v) => setCount(Number(v))} />
        </StepBlock>
      )}

      {step === 6 && (
        <StepBlock title="Optional instructions">
          <textarea
            className="ppb-input min-h-[120px]"
            placeholder="Describe any additional requirements…"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </StepBlock>
      )}

      {error && <p className="text-sm text-red-300 mt-4">{error}</p>}

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className={`focus-ring rounded-lg px-4 py-2.5 text-sm text-graphite-300 hover:bg-graphite-800 ${step === 1 ? "invisible" : ""}`}
        >
          Back
        </button>
        {step < 6 ? (
          <button
            disabled={!canProceed[step]}
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="focus-ring rounded-lg bg-gradient-to-r from-cyan-accent to-violet-accent px-5 py-2.5 text-sm font-medium text-graphite-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            className="focus-ring rounded-lg bg-gradient-to-r from-cyan-accent to-violet-accent px-5 py-2.5 text-sm font-medium text-graphite-950 hover:opacity-90"
          >
            Generate Pack
          </button>
        )}
      </div>
    </div>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-medium text-graphite-300 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: { id: string; label: string; sub?: string }[];
  selected: string;
  onSelect: (id: string) => void;
  columns?: number;
}) {
  return (
    <div className={`grid gap-2.5 ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {options.map((opt) => {
        const active = opt.id === selected;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`focus-ring rounded-xl border px-4 py-3.5 text-left transition-colors ${
              active
                ? "border-cyan-accent/50 bg-grad-accent text-graphite-100"
                : "border-graphite-700 bg-graphite-900/40 text-graphite-300 hover:border-graphite-600"
            }`}
          >
            <div className="text-sm font-medium">{opt.label}</div>
            {opt.sub && <div className="text-[11px] text-graphite-500 mt-0.5">{opt.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}
