"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PromptPack } from "@/lib/types";
import { getPacks, seedDemoDataIfNeeded } from "@/lib/store";
import RecentPackCard from "@/components/RecentPackCard";
import { EmptyState } from "@/components/ui";

const INSPIRATION_CATEGORIES = [
  { name: "Product Ads", image: "/assets/inspiration/product-ads.png", accentDot: "bg-gold", via: "via-gold/20" },
  { name: "Cinematic", image: "/assets/inspiration/cinematic.png", accentDot: "bg-cyan-accent", via: "via-cyan-accent/20" },
  { name: "Fashion", image: "/assets/inspiration/fashion.png", accentDot: "bg-violet-accent", via: "via-violet-accent/20" },
  { name: "Architecture", image: "/assets/inspiration/architecture.png", accentDot: "bg-cyan-accent", via: "via-cyan-accent/15" },
  { name: "Food", image: "/assets/inspiration/food.png", accentDot: "bg-orange-500", via: "via-orange-500/20" },
  { name: "Automotive", image: "/assets/inspiration/automotive.png", accentDot: "bg-violet-accent", via: "via-violet-accent/15" },
];

function findLuxuryAdsPack(packs: PromptPack[]): PromptPack | undefined {
  return packs.find((p) => p.category === "Product Advertising" && p.style === "Luxury" && p.model === "gpt-image");
}

export default function DashboardPage() {
  const [packs, setPacks] = useState<PromptPack[] | null>(null);

  useEffect(() => {
    seedDemoDataIfNeeded();
    setPacks(getPacks());
  }, []);

  const featuredPack = useMemo(() => (packs ? findLuxuryAdsPack(packs) : undefined), [packs]);

  if (packs === null) return null;

  return (
    <div>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="font-display text-[34px] leading-[1.08] sm:text-5xl sm:leading-[1.05] font-medium tracking-tight text-graphite-100 mb-5">
              TURN IDEAS INTO
              <br />
              PROFESSIONAL AI PROMPT PACKS
            </h1>
            <p className="text-graphite-400 max-w-md mb-8 text-[15px] leading-relaxed">
              Create, customize and package production-ready prompts for image, video, music and text.
            </p>
            <Link
              href="/create"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-accent to-violet-accent px-6 py-3.5 text-sm font-medium text-graphite-950 hover:opacity-90 transition-opacity shadow-glow"
            >
              + CREATE A PACK →
            </Link>
          </div>

          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden border border-graphite-700/60 shadow-glow">
            <Image
              src="/assets/inspiration/hero.png"
              alt="AI-generated creative visuals composed around a product shot"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* INSPIRATION */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-14 md:pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-medium tracking-wide text-graphite-300 uppercase">Inspiration</h2>
          <Link href="/create" className="focus-ring text-[12.5px] text-graphite-400 hover:text-cyan-accent">
            View all →
          </Link>
        </div>
        <div className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none">
          {INSPIRATION_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href="/create"
              className="focus-ring group relative shrink-0 w-[130px] md:w-auto aspect-[3/4] rounded-xl overflow-hidden border border-graphite-700/60 hover:border-cyan-accent/30 transition-colors snap-start"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 130px, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-graphite-950/90 ${cat.via} to-transparent`} />
              <div className="absolute inset-0 flex items-end gap-1.5 p-3">
                <span className={`h-1.5 w-1.5 rounded-full ${cat.accentDot} shrink-0 mb-[3px]`} />
                <span className="font-display text-[12px] font-medium uppercase tracking-wide text-graphite-100">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PACK */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-14 md:pb-20">
        <h2 className="font-display text-sm font-medium tracking-wide text-graphite-300 uppercase mb-5">Featured Pack</h2>
        <div className="relative rounded-2xl overflow-hidden border border-gold/30 shadow-gold">
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            <Image
              src="/assets/inspiration/featured-luxury-ads.png"
              alt="Luxury Ads — AI Product Prompt Pack"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/60 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9">
            <span className="inline-flex items-center gap-1.5 w-fit rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold-light mb-4">
              PREMIUM
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-medium tracking-tight text-graphite-100 mb-1">LUXURY ADS</h3>
            <p className="text-graphite-300 text-sm sm:text-base mb-1">AI Product Prompt Pack</p>
            <p className="text-graphite-400 text-[13px] sm:text-sm max-w-md mb-5">
              30 professional prompts for stunning product advertising.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["30 PROMPTS", "GPT-IMAGE", "PRODUCT ADVERTISING"].map((tag) => (
                <span key={tag} className="rounded-full border border-graphite-600/60 bg-graphite-900/60 px-2.5 py-1 text-[10.5px] tracking-wide text-graphite-300">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={featuredPack ? `/packs/${featuredPack.id}` : "/create"}
              className="focus-ring inline-flex items-center gap-2 w-fit rounded-xl bg-grad-gold px-5 py-3 text-sm font-medium text-graphite-950 hover:opacity-90 transition-opacity"
            >
              VIEW PACK →
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT PACKS */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-14 md:pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-medium tracking-wide text-graphite-300 uppercase">Recent Packs</h2>
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
              <RecentPackCard key={pack.id} pack={pack} />
            ))}
          </div>
        )}
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <div className="rounded-2xl border border-graphite-700/60 bg-grad-accent px-6 py-10 sm:px-10 sm:py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-graphite-100 mb-1">HAVE AN IDEA?</h2>
          <p className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-graphite-100 mb-7">BUILD THE PACK.</p>
          <Link
            href="/create"
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-accent to-violet-accent px-6 py-3.5 text-sm font-medium text-graphite-950 hover:opacity-90 transition-opacity"
          >
            + CREATE A PACK →
          </Link>
        </div>
      </section>
    </div>
  );
}
