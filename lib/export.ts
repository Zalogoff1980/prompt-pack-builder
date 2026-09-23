"use client";

import { PromptPack, ProductPackage } from "@/lib/types";

function slug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "prompt-pack";
}

function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportJSON(pack: PromptPack, product?: ProductPackage): void {
  const payload = product ? { pack, product } : { pack };
  download(`${slug(pack.name)}.json`, JSON.stringify(payload, null, 2), "application/json");
}

export function exportTXT(pack: PromptPack): void {
  const lines: string[] = [];
  lines.push(pack.name.toUpperCase());
  lines.push(`Model: ${pack.model} | Category: ${pack.category} | Style: ${pack.style}`);
  lines.push(`${pack.prompts.length} prompts`);
  lines.push("=".repeat(50));
  pack.prompts.forEach((p, i) => {
    lines.push("");
    lines.push(`${String(i + 1).padStart(2, "0")} — ${p.title}`);
    lines.push("-".repeat(30));
    lines.push("PROMPT:");
    lines.push(p.prompt);
    if (p.negativePrompt) {
      lines.push("");
      lines.push("NEGATIVE PROMPT:");
      lines.push(p.negativePrompt);
    }
    if (p.variables.length) {
      lines.push("");
      lines.push(`VARIABLES: ${p.variables.map((v) => `[${v}]`).join(", ")}`);
    }
    const settings = Object.entries(p.recommendedSettings);
    if (settings.length) {
      lines.push(`SETTINGS: ${settings.map(([k, v]) => `${k}=${v}`).join(", ")}`);
    }
    if (p.tags.length) {
      lines.push(`TAGS: ${p.tags.join(", ")}`);
    }
  });
  download(`${slug(pack.name)}.txt`, lines.join("\n"), "text/plain");
}

export function exportMarkdown(pack: PromptPack, product?: ProductPackage): void {
  const lines: string[] = [];
  if (product) {
    lines.push(`# ${product.productName}`);
    lines.push("");
    lines.push(`*${product.subtitle}*`);
    lines.push("");
    lines.push(product.description);
    lines.push("");
    if (product.whatsInside.length) {
      lines.push("## What's inside");
      product.whatsInside.forEach((item) => lines.push(`- ${item}`));
      lines.push("");
    }
  } else {
    lines.push(`# ${pack.name}`);
    lines.push("");
    if (pack.description) lines.push(`${pack.description}\n`);
  }
  lines.push(`**Model:** ${pack.model} · **Category:** ${pack.category} · **Style:** ${pack.style} · **${pack.prompts.length} prompts**`);
  lines.push("");
  lines.push("---");
  pack.prompts.forEach((p, i) => {
    lines.push("");
    lines.push(`## ${String(i + 1).padStart(2, "0")} — ${p.title}`);
    lines.push("");
    lines.push("**Prompt**");
    lines.push("");
    lines.push("```");
    lines.push(p.prompt);
    lines.push("```");
    if (p.negativePrompt) {
      lines.push("");
      lines.push("**Negative prompt**");
      lines.push("");
      lines.push("```");
      lines.push(p.negativePrompt);
      lines.push("```");
    }
    if (p.variables.length) {
      lines.push("");
      lines.push(`**Variables:** ${p.variables.map((v) => `\`[${v}]\``).join(", ")}`);
    }
    const settings = Object.entries(p.recommendedSettings);
    if (settings.length) {
      lines.push("");
      lines.push(`**Recommended settings:** ${settings.map(([k, v]) => `${k}: ${v}`).join(" · ")}`);
    }
    if (p.tags.length) {
      lines.push("");
      lines.push(`**Tags:** ${p.tags.join(", ")}`);
    }
  });
  lines.push("");
  lines.push("---");
  lines.push("_Created with Prompt Pack Builder_");
  download(`${slug(pack.name)}.md`, lines.join("\n"), "text/markdown");
}

export async function exportPDF(pack: PromptPack, product?: ProductPackage): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - marginX * 2;
  let y = 64;

  function ensureSpace(next: number) {
    if (y + next > pageHeight - 48) {
      doc.addPage();
      y = 64;
    }
  }

  function writeLines(text: string, size: number, lineHeight: number, bold = false) {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const wrapped = doc.splitTextToSize(text, maxWidth) as string[];
    wrapped.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, marginX, y);
      y += lineHeight;
    });
  }

  const title = product ? product.productName : pack.name;
  writeLines(title, 20, 26, true);
  if (product) writeLines(product.subtitle, 12, 18);
  writeLines(`Model: ${pack.model}   Category: ${pack.category}   Style: ${pack.style}   ${pack.prompts.length} prompts`, 10, 16);
  y += 8;

  pack.prompts.forEach((p, i) => {
    ensureSpace(40);
    writeLines(`${String(i + 1).padStart(2, "0")} — ${p.title}`, 13, 18, true);
    writeLines(`Prompt: ${p.prompt}`, 10, 14);
    if (p.negativePrompt) writeLines(`Negative: ${p.negativePrompt}`, 10, 14);
    if (p.variables.length) writeLines(`Variables: ${p.variables.map((v) => `[${v}]`).join(", ")}`, 10, 14);
    const settings = Object.entries(p.recommendedSettings);
    if (settings.length) writeLines(`Settings: ${settings.map(([k, v]) => `${k}=${v}`).join(", ")}`, 10, 14);
    y += 10;
  });

  doc.save(`${slug(pack.name)}.pdf`);
}
