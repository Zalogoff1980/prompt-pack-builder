"use client";

import Link from "next/link";
import { PromptPack } from "@/lib/types";
import { StatusBadge } from "@/components/ui";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PackCard({
  pack,
  actions,
}: {
  pack: PromptPack;
  actions?: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-graphite-700/60 bg-graphite-900/50 p-5 transition-colors hover:border-cyan-accent/30">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link href={`/packs/${pack.id}`} className="focus-ring min-w-0">
          <h3 className="font-display text-[15px] font-medium text-graphite-100 truncate group-hover:text-cyan-accent transition-colors">
            {pack.name}
          </h3>
        </Link>
        <StatusBadge status={pack.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-graphite-400 mb-4">
        <span>{pack.model}</span>
        <span>·</span>
        <span>{pack.prompts.length} prompts</span>
        <span>·</span>
        <span>{pack.category}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-graphite-500">Updated {formatDate(pack.updatedAt)}</span>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">{actions}</div>
      </div>
    </div>
  );
}
