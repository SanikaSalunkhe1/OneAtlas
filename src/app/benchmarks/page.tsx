"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "overall", label: "Overall / Preference" },
    { id: "reasoning", label: "Reasoning & STEM" },
    { id: "coding", label: "Coding & Software" },
    { id: "mathematics", label: "Mathematics" },
    { id: "knowledge", label: "General Knowledge" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);

    fetch(`/api/benchmarks?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setBenchmarks(json.data);
        }
      })
      .catch((err) => console.error("Error loading benchmarks:", err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight">
          Standardized Industry Benchmarks
        </h1>
        <p className="text-sm text-[#77736C] max-w-2xl leading-relaxed">
          Standardized evaluation datasets, human preference arenas, and software engineering problem suites used to measure frontier AI capability.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#171717] text-white shadow-2xs"
                    : "border border-[#E7E2D9] bg-white text-[#77736C] hover:bg-[#FAF9F6] hover:text-[#171717]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Benchmarks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-[#E7E2D9] bg-white p-6 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarks.map((b) => (
            <div
              key={b.id || b.slug}
              className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs hover:shadow-xs hover:border-[#D5CEBF] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#77736C]">
                      {b.category}
                    </span>
                    <h2 className="text-xl font-semibold text-[#171717] mt-0.5">
                      {b.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-2.5 py-1 text-[11px] font-mono text-[#171717]">
                    {b._count?.scores || 0} models evaluated
                  </span>
                </div>

                <p className="text-xs text-[#77736C] leading-relaxed line-clamp-3">
                  {b.description ||
                    "Standardized evaluation testing AI frontier systems on complex problems and edge cases."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#E7E2D9]">
                <span className="text-[11px] text-[#77736C] font-mono">
                  Verified evaluations
                </span>
                <Link
                  href={`/benchmarks/${b.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717] hover:text-[#77736C] transition-colors"
                >
                  View leaderboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
