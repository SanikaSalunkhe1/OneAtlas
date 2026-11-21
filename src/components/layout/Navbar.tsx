"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Models", href: "/" },
    { name: "Rankings", href: "/rankings" },
    { name: "Benchmarks", href: "/benchmarks" },
    { name: "Labs", href: "/labs" },
    { name: "Providers", href: "/providers" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E7E2D9] bg-[#FAF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#171717] text-white font-bold text-sm tracking-tight group-hover:opacity-90 transition-opacity">
              OA
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#171717]">
              OneAtlas
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#E5DDD0] text-[#171717]"
                      : "text-[#77736C] hover:bg-[#F2ECE1] hover:text-[#171717]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-36 sm:w-60 md:w-72">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full rounded-md border border-[#E7E2D9] bg-white pl-8 pr-7 py-1.5 text-xs text-[#171717] placeholder:text-[#A8A29E] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[#E7E2D9] bg-[#FAF9F6] px-1 text-[10px] font-mono text-[#77736C]">
              ⌘K
            </kbd>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md border border-[#E7E2D9] p-1.5 text-[#77736C] hover:text-[#171717] hover:bg-[#FAF9F6]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E2D9] bg-[#FAF9F6] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E5DDD0] text-[#171717]"
                    : "text-[#77736C] hover:bg-[#F2ECE1] hover:text-[#171717]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
