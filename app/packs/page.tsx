"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PromptPack } from "@/lib/types";
import { getPacks, deletePack, duplicatePack } from "@/lib/store";
import PackCard from "@/components/PackCard";
import ExportMenu from "@/components/ExportMenu";
import { EmptyState, useConfirm } from "@/components/ui";
import { useToast } from "@/components/Toast";

export default function MyPacksPage() {
  const [packs, setPacks] = useState<PromptPack[] | null>(null);
  const { confirm, dialog } = useConfirm();
  const { show } = useToast();

  useEffect(() => {
    setPacks(getPacks());
  }, []);

  function refresh() {
    setPacks(getPacks());
  }

  if (packs === null) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-graphite-100">My Packs</h1>
        <Link href="/create" className="focus-ring rounded-lg bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 hover:bg-graphite-700">
          + New Pack
        </Link>
      </div>

      {packs.length === 0 ? (
        <EmptyState
          title="No packs yet"
          description="Everything you create will show up here."
          action={
            <Link href="/create" className="focus-ring rounded-lg bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 hover:bg-graphite-700">
              Create a pack
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              actions={
                <div className="flex items-center gap-3">
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
                  <ExportMenu pack={pack} label="Export" />
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
                </div>
              }
            />
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}
