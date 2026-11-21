"use client";

import { Search, ChevronDown, LayoutGrid, Table as TableIcon, X } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLab: string;
  setSelectedLab: (lab: string) => void;
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCapabilities: string[];
  toggleCapability: (cap: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (m: "table" | "cards") => void;
  totalModels: number;
  filteredCount: number;
  onClearFilters: () => void;
  labs: { slug: string; name: string }[];
  providers: { slug: string; name: string }[];
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedLab,
  setSelectedLab,
  selectedProvider,
  setSelectedProvider,
  selectedType,
  setSelectedType,
  selectedCapabilities,
  toggleCapability,
  viewMode,
  setViewMode,
  totalModels,
  filteredCount,
  onClearFilters,
  labs,
  providers,
}: FilterBarProps) {
  const capabilityChips = [
    { label: "Reasoning", id: "reasoning" },
    { label: "Tool calling", id: "tool-calling" },
    { label: "Structured output", id: "structured-output" },
    { label: "Vision", id: "vision" },
    { label: "Open weights", id: "open-weights" },
    { label: "1M+ context", id: "1m-context" },
    { label: "Free", id: "free" },
    { label: "Hide deprecated", id: "hide-deprecated" },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedLab !== "all" ||
    selectedProvider !== "all" ||
    selectedType !== "all" ||
    selectedCapabilities.length > 0;

  return (
    <div className="space-y-3 pt-2">
      {/* Top Filter Row: Search, Dropdowns, Result count & View Mode toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Field */}
          <div className="relative min-w-[220px] sm:min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77736C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${totalModels.toLocaleString()} models`}
              className="w-full rounded-lg border border-[#E7E2D9] bg-white pl-9 pr-3 py-2 text-xs text-[#171717] placeholder:text-[#A8A29E] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#171717]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Labs Dropdown */}
          <div className="relative">
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="appearance-none rounded-lg border border-[#E7E2D9] bg-white pl-3 pr-8 py-2 text-xs font-medium text-[#171717] hover:border-[#D5CEBF] focus:border-[#171717] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All labs</option>
              {labs.map((lab) => (
                <option key={lab.slug} value={lab.slug}>
                  {lab.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
          </div>

          {/* Provider Dropdown */}
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="appearance-none rounded-lg border border-[#E7E2D9] bg-white pl-3 pr-8 py-2 text-xs font-medium text-[#171717] hover:border-[#D5CEBF] focus:border-[#171717] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">Any provider</option>
              {providers.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
          </div>

          {/* Model Types Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none rounded-lg border border-[#E7E2D9] bg-white pl-3 pr-8 py-2 text-xs font-medium text-[#171717] hover:border-[#D5CEBF] focus:border-[#171717] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All types</option>
              <option value="chat">Chat</option>
              <option value="reasoning">Reasoning</option>
              <option value="multimodal">Multimodal</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77736C]" />
          </div>
        </div>

        {/* Right side: Count & View Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-mono text-[#77736C]">
            {filteredCount.toLocaleString()} {filteredCount === 1 ? "model" : "models"}
          </span>

          <div className="flex items-center rounded-lg border border-[#E7E2D9] bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "table"
                  ? "bg-[#FAF9F6] text-[#171717] font-semibold border border-[#E7E2D9] shadow-2xs"
                  : "text-[#77736C] hover:text-[#171717]"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "cards"
                  ? "bg-[#FAF9F6] text-[#171717] font-semibold border border-[#E7E2D9] shadow-2xs"
                  : "text-[#77736C] hover:text-[#171717]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Capability Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {capabilityChips.map((chip) => {
          const isActive = selectedCapabilities.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => toggleCapability(chip.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#171717] text-white border border-[#171717] shadow-2xs"
                  : "border border-[#E7E2D9] bg-white text-[#77736C] hover:bg-[#FAF9F6] hover:text-[#171717]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
