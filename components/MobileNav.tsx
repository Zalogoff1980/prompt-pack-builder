"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/create", label: "Create" },
  { href: "/packs", label: "My Packs" },
  { href: "/settings", label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden sticky top-0 z-40 glass border-b border-graphite-700/60 px-4 py-2 flex items-center justify-between">
      <Link href="/" className="focus-ring rounded-full">
        <BrandMark size={30} />
      </Link>
      <nav className="flex gap-2.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`text-[11px] focus-ring rounded px-0.5 ${active ? "text-cyan-accent" : "text-graphite-500"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
