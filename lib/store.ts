"use client";

import { PromptPack, ProductPackage } from "@/lib/types";
import { buildDemoProductAdsPack } from "@/lib/ai/templates";

const PACKS_KEY = "ppb_packs_v1";
const PRODUCTS_KEY = "ppb_products_v1";
const SEEDED_KEY = "ppb_seeded_v1";

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function seedDemoDataIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY)) return;

  const packs = read<PromptPack[]>(PACKS_KEY, []);
  if (packs.length === 0) {
    const now = new Date().toISOString();
    const demoPack: PromptPack = {
      id: uid(),
      name: "Cinematic AI Product Ads",
      description: "20 cinematic prompts for commercial product-advertising video, tuned for Kling.",
      contentType: "video",
      model: "kling",
      category: "Product Advertising",
      style: "Cinematic",
      prompts: buildDemoProductAdsPack(),
      metadata: { demoMode: true },
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    write(PACKS_KEY, [demoPack]);
  }
  window.localStorage.setItem(SEEDED_KEY, "1");
}

export function getPacks(): PromptPack[] {
  return read<PromptPack[]>(PACKS_KEY, []).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getPack(id: string): PromptPack | undefined {
  return getPacks().find((p) => p.id === id);
}

export function savePack(pack: PromptPack): void {
  const packs = read<PromptPack[]>(PACKS_KEY, []);
  const idx = packs.findIndex((p) => p.id === pack.id);
  const updated = { ...pack, updatedAt: new Date().toISOString() };
  if (idx >= 0) packs[idx] = updated;
  else packs.push(updated);
  write(PACKS_KEY, packs);
}

export function deletePack(id: string): void {
  const packs = read<PromptPack[]>(PACKS_KEY, []).filter((p) => p.id !== id);
  write(PACKS_KEY, packs);
  const products = read<ProductPackage[]>(PRODUCTS_KEY, []).filter((p) => p.packId !== id);
  write(PRODUCTS_KEY, products);
}

export function duplicatePack(id: string): PromptPack | undefined {
  const pack = getPack(id);
  if (!pack) return undefined;
  const now = new Date().toISOString();
  const copy: PromptPack = {
    ...pack,
    id: uid(),
    name: `${pack.name} (Copy)`,
    status: "draft",
    prompts: pack.prompts.map((p) => ({ ...p, id: uid() })),
    createdAt: now,
    updatedAt: now,
  };
  const packs = read<PromptPack[]>(PACKS_KEY, []);
  packs.push(copy);
  write(PACKS_KEY, packs);
  return copy;
}

export function newEmptyPack(params: Pick<PromptPack, "name" | "contentType" | "model" | "category" | "style">): PromptPack {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: params.name,
    description: "",
    contentType: params.contentType,
    model: params.model,
    category: params.category,
    style: params.style,
    prompts: [],
    metadata: { demoMode: true },
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function newPromptId(): string {
  return uid();
}

// --- Product packages ---

export function getProducts(): ProductPackage[] {
  return read<ProductPackage[]>(PRODUCTS_KEY, []);
}

export function getProductForPack(packId: string): ProductPackage | undefined {
  return getProducts().find((p) => p.packId === packId);
}

export function saveProduct(product: ProductPackage): void {
  const products = read<ProductPackage[]>(PRODUCTS_KEY, []);
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  write(PRODUCTS_KEY, products);
}

export function newProductId(): string {
  return uid();
}
