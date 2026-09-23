"use client";

import { useState } from "react";
import { Prompt } from "@/lib/types";
import { useToast } from "@/components/Toast";

export default function PromptCard({
  prompt,
  index,
  regenerating,
  onEdit,
  onRegenerate,
  onDelete,
}: {
  prompt: Prompt;
  index: number;
  regenerating: boolean;
  onEdit: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { show } = useToast();
  const isLong = prompt.prompt.length > 180;
  const displayPrompt = expanded || !isLong ? prompt.prompt : `${prompt.prompt.slice(0, 180)}…`;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      show("Prompt copied");
    } catch {
      show("Couldn't copy — select and copy manually", "error");
    }
  }

  return (
    <div className="rounded-xl border border-graphite-700/60 bg-graphite-900/40 p-4 transition-colors hover:border-graphite-600">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="font-mono text-[11px] text-graphite-500">{String(index + 1).padStart(2, "0")}</span>
          <h4 className="font-display text-[13px] font-medium tracking-wide text-graphite-100 truncate">{prompt.title}</h4>
        </div>
      </div>

      <p className="font-mono text-[12.5px] leading-relaxed text-graphite-300 mb-2 whitespace-pre-wrap">
        {displayPrompt}
        {isLong && (
          <button className="focus-ring ml-1.5 text-cyan-accent hover:underline" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </p>

      {prompt.variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {prompt.variables.map((v) => (
            <span key={v} className="rounded-md bg-graphite-800 px-1.5 py-0.5 font-mono text-[10.5px] text-violet-accent">
              [{v}]
            </span>
          ))}
        </div>
      )}

      {prompt.negativePrompt && (
        <details className="mb-2 group/details">
          <summary className="cursor-pointer text-[11px] text-graphite-500 hover:text-graphite-300 focus-ring rounded select-none">
            Negative prompt
          </summary>
          <p className="font-mono text-[11.5px] text-graphite-500 mt-1 whitespace-pre-wrap">{prompt.negativePrompt}</p>
        </details>
      )}

      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-graphite-800">
        <div className="flex gap-1.5">
          <button onClick={copyPrompt} className="focus-ring rounded-md px-2.5 py-1.5 text-[11.5px] text-graphite-300 hover:bg-graphite-800">
            Copy
          </button>
          <button onClick={onEdit} className="focus-ring rounded-md px-2.5 py-1.5 text-[11.5px] text-graphite-300 hover:bg-graphite-800">
            Edit
          </button>
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="focus-ring rounded-md px-2.5 py-1.5 text-[11.5px] text-graphite-300 hover:bg-graphite-800 disabled:opacity-50"
          >
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
        </div>
        <button onClick={onDelete} className="focus-ring rounded-md px-2.5 py-1.5 text-[11.5px] text-graphite-500 hover:bg-red-500/10 hover:text-red-300">
          Delete
        </button>
      </div>
    </div>
  );
}
