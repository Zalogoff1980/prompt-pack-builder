"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Prompt, PromptPack, GenerateResponse } from "@/lib/types";
import { getPack, savePack, newPromptId } from "@/lib/store";
import PromptCard from "@/components/PromptCard";
import PromptEditorModal from "@/components/PromptEditorModal";
import ExportMenu from "@/components/ExportMenu";
import { DemoBadge, useConfirm } from "@/components/ui";
import { useToast } from "@/components/Toast";

export default function PackEditorPage() {
  const params = useParams<{ id: string }>();
  const { show } = useToast();
  const { confirm, dialog } = useConfirm();

  const [pack, setPack] = useState<PromptPack | null | undefined>(undefined);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    const found = getPack(params.id);
    setPack(found ?? null);
    if (found) setNameDraft(found.name);
  }, [params.id]);

  function persist(updated: PromptPack) {
    savePack(updated);
    setPack({ ...updated });
  }

  if (pack === undefined) return null;
  if (pack === null) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-graphite-300 mb-4">This pack couldn&apos;t be found.</p>
        <Link href="/packs" className="focus-ring text-cyan-accent hover:underline">
          Back to My Packs
        </Link>
      </div>
    );
  }

  function deletePrompt(id: string) {
    const prompts = pack!.prompts.filter((p) => p.id !== id);
    persist({ ...pack!, prompts });
    show("Prompt deleted");
  }

  function addPrompt() {
    const blank: Prompt = {
      id: newPromptId(),
      title: "New Prompt",
      prompt: "",
      negativePrompt: "",
      variables: [],
      recommendedSettings: {},
      model: pack!.model,
      category: pack!.category,
      tags: [pack!.category, pack!.style],
      createdAt: new Date().toISOString(),
    };
    setEditingPrompt(blank);
  }

  function saveNewOrEdited(updated: Prompt) {
    const exists = pack!.prompts.some((p) => p.id === updated.id);
    const prompts = exists ? pack!.prompts.map((p) => (p.id === updated.id ? updated : p)) : [...pack!.prompts, updated];
    persist({ ...pack!, prompts });
    setEditingPrompt(null);
    show(exists ? "Prompt saved" : "Prompt added");
  }

  async function regenerate(target: Prompt) {
    setRegeneratingId(target.id);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: pack!.contentType,
          model: pack!.model,
          category: pack!.category,
          style: pack!.style,
          count: 1,
          regenerateTitle: target.title,
          regenerateVariables: target.variables,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data: GenerateResponse = await res.json();
      const fresh = data.prompts[0];
      const prompts = pack!.prompts.map((p) => (p.id === target.id ? { ...fresh, id: target.id } : p));
      persist({ ...pack!, prompts, metadata: { ...pack!.metadata, demoMode: data.demoMode } });
      show("Prompt regenerated");
    } catch {
      show("Regeneration failed — try again", "error");
    } finally {
      setRegeneratingId(null);
    }
  }

  function commitRename() {
    setRenaming(false);
    if (nameDraft.trim() && nameDraft !== pack!.name) {
      persist({ ...pack!, name: nameDraft.trim() });
    } else {
      setNameDraft(pack!.name);
    }
  }

  function saveNow() {
    persist(pack!);
    show("Pack saved");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="min-w-0">
          {renaming ? (
            <input
              autoFocus
              className="ppb-input font-display text-xl font-medium max-w-md"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => e.key === "Enter" && commitRename()}
            />
          ) : (
            <h1
              className="focus-ring inline-block font-display text-2xl font-medium text-graphite-100 cursor-text hover:text-cyan-accent transition-colors"
              onClick={() => setRenaming(true)}
              title="Click to rename"
            >
              {pack.name}
            </h1>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[12.5px] text-graphite-400">
            <span>{pack.model}</span>
            <span>·</span>
            <span>{pack.category}</span>
            <span>·</span>
            <span>{pack.prompts.length} prompts</span>
            {pack.metadata.demoMode && (
              <>
                <span>·</span>
                <DemoBadge />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button onClick={saveNow} className="focus-ring rounded-lg border border-graphite-700 px-3.5 py-2 text-[13px] text-graphite-200 hover:border-graphite-500">
            Save Pack
          </button>
          <ExportMenu pack={pack} />
          <Link
            href={`/packs/${pack.id}/package`}
            className="focus-ring rounded-lg bg-gradient-to-r from-cyan-accent to-violet-accent px-3.5 py-2 text-[13px] font-medium text-graphite-950 hover:opacity-90"
          >
            Create Product
          </Link>
        </div>
      </div>

      {pack.prompts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-graphite-700 py-16 text-center px-6">
          <p className="text-sm text-graphite-400 mb-4">This pack has no prompts yet.</p>
          <button onClick={addPrompt} className="focus-ring rounded-lg bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 hover:bg-graphite-700">
            + Add Prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pack.prompts.map((p, i) => (
            <PromptCard
              key={p.id}
              prompt={p}
              index={i}
              regenerating={regeneratingId === p.id}
              onEdit={() => setEditingPrompt(p)}
              onRegenerate={() => regenerate(p)}
              onDelete={() => confirm(`Delete "${p.title}"? This can't be undone.`, () => deletePrompt(p.id))}
            />
          ))}
        </div>
      )}

      {pack.prompts.length > 0 && (
        <button
          onClick={addPrompt}
          className="focus-ring mt-4 w-full rounded-xl border border-dashed border-graphite-700 py-3 text-sm text-graphite-400 hover:border-graphite-500 hover:text-graphite-200"
        >
          + Add Prompt
        </button>
      )}

      {editingPrompt && <PromptEditorModal prompt={editingPrompt} onSave={saveNewOrEdited} onCancel={() => setEditingPrompt(null)} />}
      {dialog}
    </div>
  );
}
