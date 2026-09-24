"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/create", label: "Create Pack" },
  { href: "/packs", label: "My Packs" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-graphite-700/60 bg-graphite-900/60 px-5 py-6">
      <Link href="/" className="focus-ring flex items-center gap-3 mb-10 rounded-lg">
        <BrandMark size={34} />
        <div className="font-display text-[13px] font-medium leading-tight tracking-wide text-graphite-100">
          <div>PROMPT PACK</div>
          <div>BUILDER</div>
        </div>
      </Link>

      <div className="text-[11px] font-medium tracking-wide text-graphite-500 mb-3">Navigation</div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-grad-accent text-graphite-100 border border-cyan-accent/20 shadow-glow"
                  : "text-graphite-300 hover:bg-graphite-800 hover:text-graphite-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-graphite-700/60">
        <Link
          href="/settings"
          className={`focus-ring block rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === "/settings" ? "bg-graphite-800 text-graphite-100" : "text-graphite-400 hover:bg-graphite-800 hover:text-graphite-100"
          }`}
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
