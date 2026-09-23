"use client";

import { useState } from "react";
import { PackStatus } from "@/lib/types";

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-accent/30 bg-violet-accent/10 px-2.5 py-1 text-[11px] font-medium text-violet-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-accent" />
      Demo Mode
    </span>
  );
}

export function StatusBadge({ status }: { status: PackStatus }) {
  const isProduct = status === "product";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isProduct ? "bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/25" : "bg-graphite-700/60 text-graphite-300 border border-graphite-600/60"
      }`}
    >
      {isProduct ? "Product" : "Draft"}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-graphite-700 py-20 text-center px-6">
      <div className="font-display text-lg text-graphite-100 mb-2">{title}</div>
      <p className="text-sm text-graphite-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{ message: string; onConfirm: () => void } | null>(null);

  function confirm(message: string, onConfirm: () => void) {
    setState({ message, onConfirm });
  }

  const dialog = state ? (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4">
      <div className="glass w-full max-w-sm rounded-2xl border border-graphite-700 p-5">
        <p className="text-sm text-graphite-100 mb-5">{state.message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="focus-ring rounded-lg px-3.5 py-2 text-sm text-graphite-300 hover:bg-graphite-800"
            onClick={() => setState(null)}
          >
            Cancel
          </button>
          <button
            className="focus-ring rounded-lg bg-red-500/90 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-500"
            onClick={() => {
              state.onConfirm();
              setState(null);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
