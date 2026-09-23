"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PromptPack } from "@/lib/types";
import { getPacks, seedDemoDataIfNeeded, deletePack, duplicatePack } from "@/lib/store";
import PackCard from "@/components/PackCard";
import { EmptyState, useConfirm } from "@/components/ui";
import { useToast } from "@/components/Toast";

export default function DashboardPage() {
  const [packs, setPacks] = useState<PromptPack[] | null>(null);
  const { confirm, dialog } = useConfirm();
  const { show } = useToast();

  useEffect(() => {
    seedDemoDataIfNeeded();
    setPacks(getPacks());
  }, []);

  function refresh() {
    setPacks(getPacks());
  }

  if (packs === null) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-graphite-100 mb-3">
          Prompt Pack Builder
        </h1>
        <p className="text-graphite-400 max-w-md mb-6">Turn ideas into ready-to-use AI prompt packs.</p>
        <Link
          href="/create"
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-accent to-violet-accent px-5 py-3 text-sm font-medium text-graphite-950 hover:opacity-90 transition-opacity"
        >
          + Create New Pack
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm font-medium text-graphite-300">Recent Packs</h2>
        {packs.length > 0 && (
          <Link href="/packs" className="focus-ring text-[12.5px] text-graphite-400 hover:text-cyan-accent">
            View all
          </Link>
        )}
      </div>

      {packs.length === 0 ? (
        <EmptyState
          title="No packs yet"
          description="Create your first prompt pack — pick a content type, model and style, and generate a structured set of prompts in seconds."
          action={
            <Link href="/create" className="focus-ring rounded-lg bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 hover:bg-graphite-700">
              Create a pack
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packs.slice(0, 6).map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              actions={
                <>
                  <button
                    className="focus-ring text-[11.5px] text-graphite-400 hover:text-graphite-100"
                    onClick={() => {
                      duplicatePack(pack.id);
                      refresh();
                      show("Pack duplicated");
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    className="focus-ring text-[11.5px] text-graphite-400 hover:text-red-300"
                    onClick={() =>
                      confirm(`Delete "${pack.name}"? This can't be undone.`, () => {
                        deletePack(pack.id);
                        refresh();
                        show("Pack deleted");
                      })
                    }
                  >
                    Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}
