"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Search,
  ArrowUpDown,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RankingsPage() {
  const [category, setCategory] = useState("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [rankings, setRankings] = useState<any[]>([]);
  const [benchmarkInfo, setBenchmarkInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const categories = [
    { id: "overall", label: "Overall Intelligence", benchmark: "Chatbot Arena Elo" },
    { id: "reasoning", label: "Frontier Reasoning", benchmark: "GPQA Diamond" },
    { id: "coding", label: "Code & Software", benchmark: "HumanEval" },
    { id: "mathematics", label: "Competition Math", benchmark: "MATH 500" },
    { id: "knowledge", label: "General Knowledge", benchmark: "MMLU-Pro" },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("oneatlas_compare");
      if (saved) setSelectedForCompare(JSON.parse(saved));
    } catch {}
  }, []);

  const handleToggleCompare = (modelId: string) => {
    let next: string[];
    if (selectedForCompare.includes(modelId)) {
      next = selectedForCompare.filter((id) => id !== modelId);
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 models simultaneously.");
        return;
      }
      next = [...selectedForCompare, modelId];
    }
    setSelectedForCompare(next);
    try {
      localStorage.setItem("oneatlas_compare", JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("category", category);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    fetch(`/api/rankings?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setRankings(json.data.rankings || []);
          setBenchmarkInfo(json.data.benchmark || null);
        }
      })
      .catch((err) => console.error("Error loading rankings:", err))
      .finally(() => setIsLoading(false));
  }, [category, searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Title & Category Tabs */}
      <div className="space-y-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight">
            AI Model Rankings & Leaderboard
          </h1>
          <p className="text-sm text-[#77736C] mt-1 max-w-2xl">
            Live rankings based on verified industry benchmarks and crowdsourced blind human preference evaluations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
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

      {/* Benchmark Info Card */}
      <div className="rounded-xl border border-[#E7E2D9] bg-[#E5DDD0]/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono text-[#77736C] tracking-wider">
            Evaluation Benchmark
          </div>
          <div className="text-base font-semibold text-[#171717]">
            {benchmarkInfo?.name || "Benchmark"}
          </div>
          <p className="text-xs text-[#77736C] max-w-xl">
            {benchmarkInfo?.description ||
              "Standardized evaluation tracking performance and accuracy across frontier AI architectures."}
          </p>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leaderboard..."
            className="w-full rounded-lg border border-[#E7E2D9] bg-white pl-8 pr-3 py-1.5 text-xs text-[#171717] placeholder:text-[#A8A29E] focus:border-[#171717] focus:outline-none"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                <div className="h-4 bg-[#E5DDD0]/60 rounded w-12" />
                <div className="h-4 bg-[#E5DDD0]/60 rounded w-1/3" />
                <div className="h-4 bg-[#E5DDD0]/60 rounded w-16" />
                <div className="h-4 bg-[#E5DDD0]/60 rounded w-24" />
              </div>
            ))}
          </div>
        ) : rankings.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <h3 className="text-sm font-semibold text-[#171717]">No models found</h3>
            <p className="text-xs text-[#77736C]">
              No participating models matched your search query in this category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase text-[#77736C]">
                  <th className="py-3 px-4 w-16 text-center">RANK</th>
                  <th className="py-3 px-4">MODEL & LAB</th>
                  <th className="py-3 px-3 text-center">LICENSE</th>
                  <th className="py-3 px-4 text-right">BENCHMARK SCORE</th>
                  <th className="py-3 px-4 text-center">PROVIDERS</th>
                  <th className="py-3 px-4 text-right">RELEASED</th>
                  <th className="py-3 px-4 text-right w-24">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {rankings.map((item) => {
                  const isTop3 = item.rank <= 3;
                  const isSelected = selectedForCompare.includes(item.modelId);

                  return (
                    <tr
                      key={item.modelId}
                      className={`hover:bg-[#FAF9F6]/80 transition-colors ${
                        isTop3 ? "bg-[#FFFDF9]" : ""
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {item.rank === 1 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                            1
                          </span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300">
                            2
                          </span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                            3
                          </span>
                        ) : (
                          <span className="text-[#77736C] font-semibold">#{item.rank}</span>
                        )}
                      </td>

                      {/* Model & Company */}
                      <td className="py-3.5 px-4">
                        <div>
                          <Link
                            href={`/models/${item.slug}`}
                            className="font-semibold text-sm text-[#171717] hover:underline flex items-center gap-1.5"
                          >
                            {item.name}
                          </Link>
                          <div className="text-[11px] text-[#77736C] font-mono">
                            {item.company?.name}
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${
                            item.openWeights
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                          }`}
                        >
                          {item.openWeights ? "Open Weights" : "Proprietary"}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#171717]">
                        {item.score}
                        <span className="block text-[10px] font-normal text-[#77736C]">
                          {item.source || "Verified"}
                        </span>
                      </td>

                      {/* Providers count */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-[#77736C]">
                        ⚡ {item.providersCount || 1}
                      </td>

                      {/* Released */}
                      <td className="py-3.5 px-4 text-right text-[11px] text-[#77736C] whitespace-nowrap">
                        {formatDate(item.releasedAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleCompare(item.modelId)}
                          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-[#171717] text-white"
                              : "border border-[#E7E2D9] text-[#171717] hover:bg-[#FAF9F6]"
                          }`}
                        >
                          {isSelected ? "Compared" : "Compare"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
