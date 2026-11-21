"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, ArrowRight, Building2, Layers } from "lucide-react";

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    fetch(`/api/labs?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLabs(json.data);
        }
      })
      .catch((err) => console.error("Error loading labs:", err))
      .finally(() => setIsLoading(false));
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight">
            AI Research Labs & Creators
          </h1>
          <p className="text-sm text-[#77736C] mt-1 max-w-xl leading-relaxed">
            Frontier artificial intelligence research organizations, foundation model developers, and open source innovators.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI labs..."
            className="w-full rounded-lg border border-[#E7E2D9] bg-white pl-8 pr-3 py-1.5 text-xs text-[#171717] placeholder:text-[#A8A29E] focus:border-[#171717] focus:outline-none"
          />
        </div>
      </div>

      {/* Labs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-[#E7E2D9] bg-white p-6 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab) => (
            <div
              key={lab.id || lab.slug}
              className="rounded-2xl border border-[#E7E2D9] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#D5CEBF] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Logo & Lab Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] border border-[#E7E2D9] text-xs font-bold text-[#171717]">
                    {lab.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-base text-[#171717]">
                      {lab.name}
                    </h2>
                    <span className="text-[11px] font-mono text-[#77736C]">
                      {lab._count?.models || 1} catalog {lab._count?.models === 1 ? "model" : "models"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#77736C] line-clamp-3 leading-relaxed mb-4">
                  {lab.description ||
                    `Frontier AI lab developing state-of-the-art foundation models and specialized intelligence architectures.`}
                </p>
              </div>

              {/* Card Footer: Links */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E7E2D9]">
                {lab.website ? (
                  <a
                    href={lab.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#77736C] hover:text-[#171717] font-mono"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span />
                )}

                <Link
                  href={`/labs/${lab.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#171717] hover:text-[#77736C] transition-colors"
                >
                  View models <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
