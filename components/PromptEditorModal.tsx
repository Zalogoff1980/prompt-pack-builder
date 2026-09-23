"use client";

import { useState } from "react";
import { Prompt, RecommendedSettings } from "@/lib/types";

function settingsToText(settings: RecommendedSettings): string {
  return Object.entries(settings)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function textToSettings(text: string): RecommendedSettings {
  const settings: RecommendedSettings = {};
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (key) settings[key] = value;
      }
    });
  return settings;
}

export default function PromptEditorModal({
  prompt,
  onSave,
  onCancel,
}: {
  prompt: Prompt;
  onSave: (updated: Prompt) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(prompt.title);
  const [promptText, setPromptText] = useState(prompt.prompt);
  const [negativePrompt, setNegativePrompt] = useState(prompt.negativePrompt);
  const [variables, setVariables] = useState(prompt.variables.join(", "));
  const [settingsText, setSettingsText] = useState(settingsToText(prompt.recommendedSettings));
  const [tags, setTags] = useState(prompt.tags.join(", "));

  function handleSave() {
    onSave({
      ...prompt,
      title: title.trim() || prompt.title,
      prompt: promptText,
      negativePrompt,
      variables: variables
        .split(",")
        .map((v) => v.trim().replace(/^\[|\]$/g, ""))
        .filter(Boolean),
      recommendedSettings: textToSettings(settingsText),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  }

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/60" role="dialog" aria-modal="true">
      <div className="glass h-full w-full max-w-md border-l border-graphite-700 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-base font-medium">Edit prompt</h2>
          <button onClick={onCancel} className="focus-ring rounded-md p-1 text-graphite-400 hover:text-graphite-100" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="Title">
            <input
              className="ppb-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <Field label="Prompt">
            <textarea
              className="ppb-input font-mono text-[12.5px] min-h-[120px]"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </Field>

          <Field label="Negative prompt">
            <textarea
              className="ppb-input font-mono text-[12.5px] min-h-[70px]"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
          </Field>

          <Field label="Variables (comma-separated)">
            <input className="ppb-input font-mono text-[12.5px]" value={variables} onChange={(e) => setVariables(e.target.value)} />
          </Field>

          <Field label="Recommended settings (one key: value per line)">
            <textarea
              className="ppb-input font-mono text-[12.5px] min-h-[80px]"
              value={settingsText}
              onChange={(e) => setSettingsText(e.target.value)}
            />
          </Field>

          <Field label="Tags (comma-separated)">
            <input className="ppb-input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button onClick={onCancel} className="focus-ring rounded-lg px-4 py-2.5 text-sm text-graphite-300 hover:bg-graphite-800">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="focus-ring rounded-lg bg-gradient-to-r from-cyan-accent to-violet-accent px-4 py-2.5 text-sm font-medium text-graphite-950 hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] text-graphite-400">{label}</span>
      {children}
    </label>
  );
}
