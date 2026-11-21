"use client";

import Link from "next/link";
import { Check, HelpCircle, Layers, ArrowUpDown, ChevronDown, ChevronUp, Plus, CheckCircle2 } from "lucide-react";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

interface ModelTableProps {
  models: any[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  selectedForCompare: string[];
  onToggleCompare: (modelId: string) => void;
}

export function ModelTable({
  models,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  selectedForCompare,
  onToggleCompare,
}: ModelTableProps) {
  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-[#E7E2D9] bg-white overflow-hidden shadow-2xs">
        <div className="p-8 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-1/4" />
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-16" />
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-16" />
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-20" />
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-24" />
              <div className="h-4 bg-[#E5DDD0]/60 rounded w-16" />
            </div>
          ))}
        </div>
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
          No models matched your active search query or selected capability filters. Try clearing some filters or searching for another term.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 text-[#A8A29E] opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#171717]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#171717]" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#E7E2D9] bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase tracking-wider text-[#77736C]">
              <th className="py-3 pl-4 pr-2 w-8">
                <span className="sr-only">Compare</span>
              </th>
              <th
                onClick={() => onSort("name")}
                className="py-3 px-3 cursor-pointer hover:text-[#171717] group transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  MODEL
                  {renderSortIndicator("name")}
                </div>
              </th>
              <th className="py-3 px-2 text-center">PROVIDERS</th>
              <th
                onClick={() => onSort("contextLength")}
                className="py-3 px-2 cursor-pointer hover:text-[#171717] group transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  CONTEXT
                  {renderSortIndicator("contextLength")}
                </div>
              </th>
              <th className="py-3 px-2 text-right">OUTPUT</th>
              <th className="py-3 px-2 text-center">MODALITIES</th>
              <th className="py-3 px-2 text-center">REASONING</th>
              <th className="py-3 px-2 text-center">TOOLS</th>
              <th className="py-3 px-2 text-center">JSON</th>
              <th className="py-3 px-2 text-center">TEMP</th>
              <th className="py-3 px-2 text-center">WEIGHTS</th>
              <th
                onClick={() => onSort("price")}
                className="py-3 px-3 cursor-pointer hover:text-[#171717] group transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  PRICE / 1M
                  {renderSortIndicator("price")}
                </div>
              </th>
              <th className="py-3 px-2 text-right">CACHE</th>
              <th className="py-3 px-2 text-center">INTELLIGENCE</th>
              <th className="py-3 px-2">RELEASED</th>
              <th
                onClick={() => onSort("updatedAt")}
                className="py-3 pr-4 pl-2 cursor-pointer hover:text-[#171717] group transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  UPDATED
                  {renderSortIndicator("updatedAt")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E2D9] text-xs">
            {models.map((model) => {
              const isSelected = selectedForCompare.includes(model.id);
              const primaryProvider = model.providers?.[0];
              const inputPrice = primaryProvider?.inputPrice;
              const outputPrice = primaryProvider?.outputPrice;
              const cachePrice = primaryProvider?.cachePrice;

              // Find Arena Elo or best benchmark score
              const arenaScore = model.benchmarks?.find(
                (b: any) => b.benchmark?.slug === "arena-elo" || b.benchmarkSlug === "arena-elo"
              )?.score;

              // Modalities badge string
              const inMods = model.inputModalities?.join("+") || "T";
              const outMods = model.outputModalities?.join("+") || "T";
              const modalitiesStr = `${inMods} → ${outMods}`;

              return (
                <tr
                  key={model.id}
                  className={`hover:bg-[#FAF9F6]/80 transition-colors group ${
                    isSelected ? "bg-[#F7F4EC]" : ""
                  }`}
                >
                  {/* Compare Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <button
                      onClick={() => onToggleCompare(model.id)}
                      title={isSelected ? "Remove from compare" : "Add to compare"}
                      className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#171717] border-[#171717] text-white"
                          : "border-[#D5CEBF] bg-white hover:border-[#171717]"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3 stroke-[3]" />
                      ) : (
                        <Plus className="h-2.5 w-2.5 text-transparent group-hover:text-[#77736C]" />
                      )}
                    </button>
                  </td>

                  {/* Model Name, Badge, Company, ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#FAF9F6] border border-[#E7E2D9] text-[10px] font-bold text-[#171717]">
                        {model.company?.name?.slice(0, 2).toUpperCase() || "AI"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/models/${model.slug}`}
                            className="font-semibold text-[#171717] hover:underline underline-offset-2 flex items-center gap-1"
                          >
                            {model.name}
                          </Link>
                          {model.isNew && (
                            <span className="rounded bg-[#E5DDD0] px-1.5 py-0.2 text-[9px] font-mono font-medium text-[#171717] uppercase">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#77736C] font-mono truncate max-w-[220px]">
                          {model.company?.name} · {model.modelId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Providers */}
                  <td className="py-3 px-2 text-center font-mono">
                    <span className="inline-flex items-center gap-1 rounded bg-[#FAF9F6] px-1.5 py-0.5 border border-[#E7E2D9] text-[11px] text-[#171717]">
                      ⚡ {model.providers?.length || 1}
                    </span>
                  </td>

                  {/* Context */}
                  <td className="py-3 px-2 text-right font-mono text-[#171717]">
                    {formatContext(model.contextLength)}
                  </td>

                  {/* Output */}
                  <td className="py-3 px-2 text-right font-mono text-[#77736C]">
                    {formatContext(model.maxOutput)}
                  </td>

                  {/* Modalities */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-block rounded bg-[#FAF9F6] border border-[#E7E2D9] px-1.5 py-0.5 text-[10px] font-mono text-[#171717]">
                      {modalitiesStr}
                    </span>
                  </td>

                  {/* Reasoning */}
                  <td className="py-3 px-2 text-center">
                    {model.reasoning ? (
                      <Check className="h-4 w-4 text-[#171717] mx-auto stroke-[2.5]" />
                    ) : (
                      <span className="text-[#A8A29E]">—</span>
                    )}
                  </td>

                  {/* Tools */}
                  <td className="py-3 px-2 text-center">
                    {model.toolCalling ? (
                      <Check className="h-4 w-4 text-[#171717] mx-auto stroke-[2.5]" />
                    ) : (
                      <span className="text-[#A8A29E]">—</span>
                    )}
                  </td>

                  {/* JSON */}
                  <td className="py-3 px-2 text-center">
                    {model.structuredOutput ? (
                      <Check className="h-4 w-4 text-[#171717] mx-auto stroke-[2.5]" />
                    ) : (
                      <span className="text-[#A8A29E]">—</span>
                    )}
                  </td>

                  {/* Temp */}
                  <td className="py-3 px-2 text-center">
                    {model.supportsTemperature ? (
                      <Check className="h-4 w-4 text-[#171717] mx-auto stroke-[2.5]" />
                    ) : (
                      <span className="text-[#77736C] font-mono text-[11px]">?</span>
                    )}
                  </td>

                  {/* Weights */}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${
                        model.openWeights
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                      }`}
                    >
                      {model.openWeights ? "Open" : "Closed"}
                    </span>
                  </td>

                  {/* Price / 1M */}
                  <td className="py-3 px-3 text-right font-mono font-medium text-[#171717]">
                    {inputPrice !== null && inputPrice !== undefined
                      ? `${formatPrice(inputPrice)} / ${formatPrice(outputPrice)}`
                      : "—"}
                  </td>

                  {/* Cache Price */}
                  <td className="py-3 px-2 text-right font-mono text-[#77736C]">
                    {cachePrice !== null && cachePrice !== undefined
                      ? formatPrice(cachePrice)
                      : "—"}
                  </td>

                  {/* Intelligence Score */}
                  <td className="py-3 px-2 text-center font-mono font-medium text-[#171717]">
                    {arenaScore ? arenaScore : "—"}
                  </td>

                  {/* Released */}
                  <td className="py-3 px-2 text-[11px] text-[#77736C] whitespace-nowrap">
                    {formatDate(model.releasedAt)}
                  </td>

                  {/* Updated */}
                  <td className="py-3 pr-4 pl-2 text-right text-[11px] text-[#77736C] whitespace-nowrap">
                    {formatDate(model.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
