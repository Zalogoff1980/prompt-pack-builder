"use client";

import { useState, useRef, useEffect } from "react";
import { PromptPack, ProductPackage } from "@/lib/types";
import { exportJSON, exportMarkdown, exportTXT, exportPDF } from "@/lib/export";
import { useToast } from "@/components/Toast";

export default function ExportMenu({ pack, product, label = "Export Pack" }: { pack: PromptPack; product?: ProductPackage; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { show } = useToast();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function handle(format: "json" | "md" | "txt" | "pdf") {
    setOpen(false);
    try {
      if (format === "json") exportJSON(pack, product);
      else if (format === "md") exportMarkdown(pack, product);
      else if (format === "txt") exportTXT(pack);
      else await exportPDF(pack, product);
      show(`Exported as ${format.toUpperCase()}`);
    } catch {
      show("Export failed — try again", "error");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring rounded-lg border border-graphite-700 px-3.5 py-2 text-[13px] text-graphite-200 hover:border-graphite-500"
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-lg border border-graphite-700 bg-graphite-900 py-1 shadow-xl z-20">
          {[
            { id: "md", label: "Markdown" },
            { id: "txt", label: "TXT" },
            { id: "json", label: "JSON" },
            { id: "pdf", label: "PDF" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handle(opt.id as "json" | "md" | "txt" | "pdf")}
              className="focus-ring block w-full px-3 py-2 text-left text-[13px] text-graphite-300 hover:bg-graphite-800 hover:text-graphite-100"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
