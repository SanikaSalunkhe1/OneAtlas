"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Trash2,
  X,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allModels, setAllModels] = useState<any[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modelToAdd, setModelToAdd] = useState("");

  // 1. Fetch full catalog of models
  useEffect(() => {
    fetch("/api/models?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAllModels(json.data);
        }
      })
      .catch((err) => console.error("Error loading models:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // 2. Initialize selected models from URL searchParams or localStorage
  useEffect(() => {
    const queryModels = searchParams?.get("models");
    if (queryModels) {
      const slugs = queryModels.split(",").map((s) => s.trim()).filter(Boolean);
      setSelectedSlugs(slugs);
    } else {
      try {
        const saved = localStorage.getItem("oneatlas_compare");
        if (saved) {
          const ids: string[] = JSON.parse(saved);
          if (allModels.length > 0) {
            const slugs = allModels
              .filter((m) => ids.includes(m.id) || ids.includes(m.slug))
              .map((m) => m.slug);
            if (slugs.length > 0) setSelectedSlugs(slugs);
          }
        }
      } catch {}
    }
  }, [searchParams, allModels]);

  const handleRemoveModel = (slug: string) => {
    const updated = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(updated);
    try {
      localStorage.setItem("oneatlas_compare", JSON.stringify(updated));
    } catch {}
    router.push(`/compare?models=${updated.join(",")}`);
  };

  const handleClearAll = () => {
    setSelectedSlugs([]);
    try {
      localStorage.removeItem("oneatlas_compare");
    } catch {}
    router.push("/compare");
  };

  const handleAddModel = (slug: string) => {
    if (!slug) return;
    if (selectedSlugs.includes(slug)) return;
    if (selectedSlugs.length >= 3) {
      alert("You can compare a maximum of 3 models at the same time.");
      return;
    }
    const updated = [...selectedSlugs, slug];
    setSelectedSlugs(updated);
    try {
      localStorage.setItem("oneatlas_compare", JSON.stringify(updated));
    } catch {}
    router.push(`/compare?models=${updated.join(",")}`);
    setModelToAdd("");
  };

  const modelsToCompare = useMemo(() => {
    return selectedSlugs
      .map((slug) => allModels.find((m) => m.slug === slug || m.id === slug))
      .filter(Boolean);
  }, [selectedSlugs, allModels]);

  const cheapestInput = useMemo(() => {
    const validPrices = modelsToCompare
      .map((m) => m.providers?.[0]?.inputPrice)
      .filter((p) => p !== null && p !== undefined);
    if (validPrices.length < 2) return null;
    return Math.min(...validPrices);
  }, [modelsToCompare]);

  const cheapestOutput = useMemo(() => {
    const validPrices = modelsToCompare
      .map((m) => m.providers?.[0]?.outputPrice)
      .filter((p) => p !== null && p !== undefined);
    if (validPrices.length < 2) return null;
    return Math.min(...validPrices);
  }, [modelsToCompare]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77736C] hover:text-[#171717] mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Models
          </Link>
          <h1 className="text-3xl font-serif text-[#171717]">Model Comparison</h1>
          <p className="text-xs text-[#77736C]">
            Compare technical specs, modalities, pricing economics, and benchmark scores side-by-side.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedSlugs.length < 3 && (
            <div className="flex items-center gap-1.5">
              <select
                value={modelToAdd}
                onChange={(e) => handleAddModel(e.target.value)}
                className="rounded-lg border border-[#E7E2D9] bg-white px-3 py-1.5 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
              >
                <option value="">+ Add model to compare...</option>
                {allModels
                  .filter((m) => !selectedSlugs.includes(m.slug))
                  .map((m) => (
                    <option key={m.id} value={m.slug}>
                      {m.name} ({m.company?.name})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {selectedSlugs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 rounded-lg border border-[#E7E2D9] bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          )}
        </div>
      </div>

      {modelsToCompare.length === 0 ? (
        <div className="rounded-2xl border border-[#E7E2D9] bg-white p-12 text-center shadow-2xs space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF9F6] text-[#77736C]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#171717]">No Models Selected for Comparison</h2>
          <p className="text-xs text-[#77736C] max-w-md mx-auto">
            Select 2 or 3 models from the main catalog or pick from the dropdown above to analyze specifications, pricing, and capabilities side-by-side.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
            >
              Browse AI models
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E7E2D9] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6]">
                  <th className="p-4 w-48 text-xs font-mono uppercase text-[#77736C]">
                    Model ({modelsToCompare.length}/3)
                  </th>
                  {modelsToCompare.map((model) => (
                    <th key={model.id} className="p-4 align-top w-72">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-medium text-[#77736C]">
                              {model.company?.name}
                            </span>
                            <div className="font-semibold text-base text-[#171717]">
                              {model.name}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveModel(model.slug)}
                            className="rounded p-1 text-[#77736C] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove from compare"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              model.openWeights
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                            }`}
                          >
                            {model.openWeights ? "Open Weights" : "Closed"}
                          </span>
                          <Link
                            href={`/models/${model.slug}`}
                            className="text-[10px] font-mono text-[#77736C] hover:text-[#171717] flex items-center gap-0.5"
                          >
                            Details <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E7E2D9] text-xs">
                {/* SECTION: Overview */}
                <tr className="bg-[#FAF9F6]/50">
                  <td colSpan={modelsToCompare.length + 1} className="py-2 px-4 font-mono font-semibold text-[10px] uppercase text-[#77736C] tracking-wider">
                    Overview & Architecture
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Model Identifier</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono text-[#171717]">
                      {m.modelId}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Model Type</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono capitalize text-[#171717]">
                      {m.modelType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Release Date</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono text-[#171717]">
                      {formatDate(m.releasedAt)}
                    </td>
                  ))}
                </tr>

                {/* SECTION: Pricing Economics */}
                <tr className="bg-[#FAF9F6]/50">
                  <td colSpan={modelsToCompare.length + 1} className="py-2 px-4 font-mono font-semibold text-[10px] uppercase text-[#77736C] tracking-wider">
                    Pricing Economics (per 1M tokens)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Input Price</td>
                  {modelsToCompare.map((m) => {
                    const price = m.providers?.[0]?.inputPrice;
                    const isCheapest = cheapestInput !== null && price === cheapestInput;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-semibold">
                        <span className={isCheapest ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200" : "text-[#171717]"}>
                          {formatPrice(price)}
                          {isCheapest && <span className="text-[10px] ml-1">★ Cheaper</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Output Price</td>
                  {modelsToCompare.map((m) => {
                    const price = m.providers?.[0]?.outputPrice;
                    const isCheapest = cheapestOutput !== null && price === cheapestOutput;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-semibold">
                        <span className={isCheapest ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200" : "text-[#171717]"}>
                          {formatPrice(price)}
                          {isCheapest && <span className="text-[10px] ml-1">★ Cheaper</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Cached Price</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono text-[#77736C]">
                      {formatPrice(m.providers?.[0]?.cachePrice)}
                    </td>
                  ))}
                </tr>

                {/* SECTION: Context & Limits */}
                <tr className="bg-[#FAF9F6]/50">
                  <td colSpan={modelsToCompare.length + 1} className="py-2 px-4 font-mono font-semibold text-[10px] uppercase text-[#77736C] tracking-wider">
                    Context Window & Token Limits
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Context Window</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono font-bold text-[#171717]">
                      {formatContext(m.contextLength)} ({m.contextLength?.toLocaleString()} tokens)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Max Output Generation</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono text-[#171717]">
                      {formatContext(m.maxOutput)} ({m.maxOutput?.toLocaleString()} tokens)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Modalities</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono text-[#171717]">
                      {m.inputModalities?.join("+")} → {m.outputModalities?.join("+")}
                    </td>
                  ))}
                </tr>

                {/* SECTION: Capabilities */}
                <tr className="bg-[#FAF9F6]/50">
                  <td colSpan={modelsToCompare.length + 1} className="py-2 px-4 font-mono font-semibold text-[10px] uppercase text-[#77736C] tracking-wider">
                    Core Capabilities
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Reasoning / CoT</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono">
                      {m.reasoning ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#A8A29E]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Tool Calling / Functions</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono">
                      {m.toolCalling ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#A8A29E]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Structured Output / JSON</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono">
                      {m.structuredOutput ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#A8A29E]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Temperature Support</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-mono">
                      {m.supportsTemperature ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> Configurable
                        </span>
                      ) : (
                        <span className="text-amber-700">Fixed (1.0)</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* SECTION: Benchmark Scores */}
                <tr className="bg-[#FAF9F6]/50">
                  <td colSpan={modelsToCompare.length + 1} className="py-2 px-4 font-mono font-semibold text-[10px] uppercase text-[#77736C] tracking-wider">
                    Verified Benchmark Evaluations
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">Chatbot Arena Elo</td>
                  {modelsToCompare.map((m) => {
                    const score = m.benchmarks?.find((b: any) => b.benchmark?.slug === "arena-elo")?.score;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-[#171717]">
                        {score || "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">HumanEval (Coding)</td>
                  {modelsToCompare.map((m) => {
                    const score = m.benchmarks?.find((b: any) => b.benchmark?.slug === "humaneval")?.score;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-[#171717]">
                        {score ? `${score}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">MATH 500 (Competition)</td>
                  {modelsToCompare.map((m) => {
                    const score = m.benchmarks?.find((b: any) => b.benchmark?.slug === "math-500")?.score;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-[#171717]">
                        {score ? `${score}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#77736C]">GPQA Diamond (Reasoning)</td>
                  {modelsToCompare.map((m) => {
                    const score = m.benchmarks?.find((b: any) => b.benchmark?.slug === "gpqa-diamond")?.score;
                    return (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-[#171717]">
                        {score ? `${score}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#77736C]">Loading comparison workspace...</div>}>
      <CompareContent />
    </Suspense>
  );
}
