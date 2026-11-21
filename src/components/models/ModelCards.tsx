"use client";

import Link from "next/link";
import { Check, Plus, Layers, Sparkles, ExternalLink, Cpu } from "lucide-react";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

interface ModelCardsProps {
  models: any[];
  isLoading: boolean;
  selectedForCompare: string[];
  onToggleCompare: (modelId: string) => void;
}

export function ModelCards({
  models,
  isLoading,
  selectedForCompare,
  onToggleCompare,
}: ModelCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E7E2D9] bg-white p-5 space-y-4 animate-pulse"
          >
            <div className="h-4 bg-[#E5DDD0]/60 rounded w-1/2" />
            <div className="h-12 bg-[#E5DDD0]/40 rounded w-full" />
            <div className="h-6 bg-[#E5DDD0]/60 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="w-full rounded-xl border border-[#E7E2D9] bg-white p-12 text-center shadow-2xs space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF9F6] text-[#77736C]">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[#171717]">No AI models found</h3>
        <p className="text-xs text-[#77736C] max-w-sm mx-auto">
          No models matched your active filters. Try resetting search criteria or capability chips.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => {
        const isSelected = selectedForCompare.includes(model.id);
        const primaryProvider = model.providers?.[0];
        const inputPrice = primaryProvider?.inputPrice;
        const outputPrice = primaryProvider?.outputPrice;

        return (
          <div
            key={model.id}
            className={`rounded-xl border transition-all flex flex-col justify-between p-5 bg-white shadow-2xs hover:shadow-xs hover:border-[#D5CEBF] ${
              isSelected ? "border-[#171717] ring-1 ring-[#171717]" : "border-[#E7E2D9]"
            }`}
          >
            <div>
              {/* Header: Company & Badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FAF9F6] border border-[#E7E2D9] text-[10px] font-bold text-[#171717]">
                    {model.company?.name?.slice(0, 2).toUpperCase() || "AI"}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-[#77736C]">
                      {model.company?.name}
                    </div>
                    <Link
                      href={`/models/${model.slug}`}
                      className="font-semibold text-base text-[#171717] hover:underline flex items-center gap-1.5"
                    >
                      {model.name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {model.isNew && (
                    <span className="rounded bg-[#E5DDD0] px-1.5 py-0.5 text-[9px] font-mono font-medium text-[#171717] uppercase">
                      NEW
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      model.openWeights
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                    }`}
                  >
                    {model.openWeights ? "Open" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#77736C] line-clamp-2 leading-relaxed mb-4">
                {model.description || "Frontier AI model available for API integration and inference."}
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#FAF9F6] border border-[#E7E2D9] mb-4 text-center">
                <div>
                  <div className="text-[10px] text-[#77736C] uppercase font-mono">Context</div>
                  <div className="text-xs font-semibold text-[#171717] font-mono mt-0.5">
                    {formatContext(model.contextLength)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#77736C] uppercase font-mono">Input / 1M</div>
                  <div className="text-xs font-semibold text-[#171717] font-mono mt-0.5">
                    {inputPrice !== null && inputPrice !== undefined
                      ? formatPrice(inputPrice)
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#77736C] uppercase font-mono">Output / 1M</div>
                  <div className="text-xs font-semibold text-[#171717] font-mono mt-0.5">
                    {outputPrice !== null && outputPrice !== undefined
                      ? formatPrice(outputPrice)
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Capabilities Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {model.reasoning && (
                  <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-2 py-0.5 text-[10px] font-medium text-[#171717]">
                    Reasoning
                  </span>
                )}
                {model.toolCalling && (
                  <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-2 py-0.5 text-[10px] font-medium text-[#171717]">
                    Tools
                  </span>
                )}
                {model.structuredOutput && (
                  <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-2 py-0.5 text-[10px] font-medium text-[#171717]">
                    JSON
                  </span>
                )}
                {model.inputModalities?.includes("I") && (
                  <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-2 py-0.5 text-[10px] font-medium text-[#171717]">
                    Vision
                  </span>
                )}
              </div>
            </div>

            {/* Footer: Providers & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E7E2D9]">
              <span className="text-[11px] text-[#77736C] font-mono">
                ⚡ {model.providers?.length || 1} {model.providers?.length === 1 ? "provider" : "providers"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleCompare(model.id)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#171717] text-white"
                      : "border border-[#E7E2D9] bg-white text-[#171717] hover:bg-[#FAF9F6]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3 w-3" />
                      Compared
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      Compare
                    </>
                  )}
                </button>
                <Link
                  href={`/models/${model.slug}`}
                  className="rounded-md border border-[#E7E2D9] p-1 text-[#77736C] hover:text-[#171717] hover:bg-[#FAF9F6]"
                  title="View full record"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
