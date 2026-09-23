"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PromptPack, ProductPackage } from "@/lib/types";
import { getPack, getProductForPack, saveProduct, newProductId, savePack } from "@/lib/store";
import { suggestProductCopy } from "@/lib/ai/templates";
import ExportMenu from "@/components/ExportMenu";
import { useToast } from "@/components/Toast";

export default function ProductPackagingPage() {
  const params = useParams<{ id: string }>();
  const { show } = useToast();

  const [pack, setPack] = useState<PromptPack | null | undefined>(undefined);
  const [productName, setProductName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [salesCopy, setSalesCopy] = useState("");
  const [whatsInside, setWhatsInside] = useState<string[]>([]);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    const found = getPack(params.id);
    setPack(found ?? null);
    if (found) {
      const existing = getProductForPack(found.id);
      if (existing) {
        setExistingId(existing.id);
        setProductName(existing.productName);
        setSubtitle(existing.subtitle);
        setDescription(existing.description);
        setAuthor(existing.author);
        setSalesCopy(existing.salesCopy);
        setWhatsInside(existing.whatsInside);
      } else {
        applySuggestion(found);
      }
    }
  }, [params.id]);

  function applySuggestion(p: PromptPack) {
    const suggestion = suggestProductCopy({ packName: p.name, category: p.category, model: p.model, promptCount: p.prompts.length, style: p.style });
    setProductName(suggestion.productName);
    setSubtitle(suggestion.subtitle);
    setDescription(suggestion.description);
    setSalesCopy(suggestion.salesCopy);
    setWhatsInside(suggestion.whatsInside);
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

  function handleSave() {
    const product: ProductPackage = {
      id: existingId ?? newProductId(),
      packId: pack!.id,
      productName,
      subtitle,
      description,
      author,
      salesCopy,
      whatsInside,
      tags: [pack!.category, pack!.style, pack!.model],
      createdAt: new Date().toISOString(),
    };
    saveProduct(product);
    setExistingId(product.id);
    savePack({ ...pack!, status: "product" });
    show("Product saved");
  }

  const product: ProductPackage = {
    id: existingId ?? "preview",
    packId: pack.id,
    productName,
    subtitle,
    description,
    author,
    salesCopy,
    whatsInside,
    tags: [pack.category, pack.style, pack.model],
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-medium text-graphite-100">Product Packaging</h1>
          <p className="text-[12.5px] text-graphite-500 mt-1">Turn &quot;{pack.name}&quot; into a product you can sell.</p>
        </div>
        <Link href={`/packs/${pack.id}`} className="focus-ring text-[13px] text-graphite-400 hover:text-graphite-100">
          Back to editor
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-medium text-graphite-300">Details</h2>
            <button
              onClick={() => applySuggestion(pack)}
              className="focus-ring rounded-md px-2.5 py-1.5 text-[12px] text-cyan-accent hover:bg-cyan-accent/10"
            >
              ✦ AI Suggest
            </button>
          </div>

          <Field label="Product name">
            <input className="ppb-input" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <input className="ppb-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea className="ppb-input min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Sales copy">
            <textarea className="ppb-input min-h-[90px]" value={salesCopy} onChange={(e) => setSalesCopy(e.target.value)} />
          </Field>
          <Field label="Author">
            <input className="ppb-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name or brand" />
          </Field>

          <div className="grid grid-cols-3 gap-3 text-[12.5px] text-graphite-400">
            <div>
              <div className="text-graphite-500">Category</div>
              <div className="text-graphite-200">{pack.category}</div>
            </div>
            <div>
              <div className="text-graphite-500">Model</div>
              <div className="text-graphite-200">{pack.model}</div>
            </div>
            <div>
              <div className="text-graphite-500">Prompts</div>
              <div className="text-graphite-200">{pack.prompts.length}</div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="focus-ring rounded-lg bg-gradient-to-r from-cyan-accent to-violet-accent px-4 py-2.5 text-sm font-medium text-graphite-950 hover:opacity-90"
            >
              Save Product
            </button>
            <ExportMenu pack={pack} product={product} label="Export Product" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-medium text-graphite-300 mb-4">Preview</h2>
          <div className="rounded-2xl border border-graphite-700 bg-gradient-to-b from-graphite-900 to-graphite-950 p-7">
            <h3 className="font-display text-xl font-medium text-graphite-100 mb-1.5">{productName || "Untitled product"}</h3>
            <p className="text-[13px] text-graphite-400 mb-4">{subtitle}</p>
            <p className="text-[13px] text-graphite-300 leading-relaxed mb-5">{description}</p>

            {whatsInside.length > 0 && (
              <div className="mb-5">
                <div className="text-[11.5px] font-medium text-graphite-500 mb-2">What&apos;s inside</div>
                <ul className="flex flex-col gap-1.5">
                  {whatsInside.map((item, i) => (
                    <li key={i} className="text-[13px] text-graphite-200 flex items-center gap-2">
                      <span className="text-cyan-accent">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-graphite-800 text-[11px] text-graphite-500">
              Created with Prompt Pack Builder{author ? ` · ${author}` : ""}
            </div>
          </div>
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
