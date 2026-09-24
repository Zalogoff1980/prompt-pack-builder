import Link from "next/link";
import Image from "next/image";
import { PromptPack } from "@/lib/types";
import { StatusBadge } from "@/components/ui";

// Deterministic gradient per pack so the same pack always gets the same
// placeholder (no preview image is stored on PromptPack, so this is a
// visual stand-in only — no data model change).
const GRADIENTS = [
  "from-cyan-accent/25 via-graphite-900 to-violet-accent/20",
  "from-violet-accent/25 via-graphite-900 to-cyan-accent/15",
  "from-gold/25 via-graphite-900 to-graphite-800",
  "from-graphite-700 via-graphite-900 to-cyan-accent/15",
];

function gradientFor(pack: PromptPack): string {
  const seed = (pack.category + pack.style).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return GRADIENTS[seed % GRADIENTS.length];
}

function isLuxuryAdsPack(pack: PromptPack): boolean {
  return pack.category === "Product Advertising" && pack.style === "Luxury" && pack.model === "gpt-image";
}

export default function RecentPackCard({ pack }: { pack: PromptPack }) {
  const luxury = isLuxuryAdsPack(pack);

  return (
    <Link
      href={`/packs/${pack.id}`}
      className="focus-ring group block rounded-2xl border border-graphite-700/60 bg-graphite-900/40 overflow-hidden transition-colors hover:border-cyan-accent/30"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {luxury ? (
          <Image
            src="/assets/inspiration/featured-luxury-ads.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`relative h-full w-full bg-gradient-to-br ${gradientFor(pack)} flex items-center justify-center`}>
            <span className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-graphite-100/25">
              {pack.contentType}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={pack.status} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-display text-[13.5px] font-medium text-graphite-100 truncate group-hover:text-cyan-accent transition-colors mb-0.5">
          {pack.name}
        </h3>
        <p className="text-[11px] text-graphite-400 uppercase tracking-wide">
          {pack.model} · {pack.prompts.length} prompts
        </p>
        <p className="text-[11px] text-graphite-500">{pack.category}</p>
      </div>
    </Link>
  );
}
