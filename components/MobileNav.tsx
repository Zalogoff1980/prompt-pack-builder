"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/create", label: "Create" },
  { href: "/packs", label: "My Packs" },
  { href: "/settings", label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden sticky top-0 z-40 glass border-b border-graphite-700/60 px-4 py-3 flex items-center justify-between">
      <div className="font-display text-sm font-medium">Prompt Pack Builder</div>
      <nav className="flex gap-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`text-xs focus-ring rounded px-1 ${active ? "text-cyan-accent" : "text-graphite-400"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
