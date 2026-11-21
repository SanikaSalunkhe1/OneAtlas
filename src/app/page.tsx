"use client";

import { useState, useEffect, useMemo } from "react";
import { HeroSection } from "@/components/models/HeroSection";
import { FilterBar } from "@/components/models/FilterBar";
import { ModelTable } from "@/components/models/ModelTable";
import { ModelCards } from "@/components/models/ModelCards";
import { CompareTray } from "@/components/models/CompareTray";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalModels: 1118,
    totalLabs: 78,
    totalProviders: 223,
    totalListings: 8274,
    releasesPerMonth: [
      { month: "Dec 25", count: 32 },
      { month: "Jan 26", count: 45 },
      { month: "Feb 26", count: 48 },
      { month: "Mar 26", count: 62 },
      { month: "Apr 26", count: 39 },
      { month: "May 26", count: 71 },
      { month: "Jun 26", count: 54 },
      { month: "Jul 26", count: 68 },
      { month: "Aug 26", count: 82 },
      { month: "Sep 26", count: 96 },
      { month: "Oct 26", count: 74 },
      { month: "Nov 26", count: 88 },
    ],
    capabilityCoverage: {
      toolCalling: 66,
      reasoning: 50,
      vision: 58,
      openWeights: 45,
    },
  });

  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Compare selection (persisted in localStorage)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Known labs & providers for dropdown options
  const labsList = [
    { slug: "openai", name: "OpenAI" },
    { slug: "anthropic", name: "Anthropic" },
    { slug: "google", name: "Google DeepMind" },
    { slug: "deepseek", name: "DeepSeek" },
    { slug: "meta", name: "Meta AI" },
    { slug: "mistral", name: "Mistral AI" },
    { slug: "alibaba", name: "Alibaba Cloud" },
    { slug: "xai", name: "xAI" },
  ];

  const providersList = [
    { slug: "openrouter", name: "OpenRouter" },
    { slug: "together-ai", name: "Together AI" },
    { slug: "groq", name: "Groq" },
    { slug: "fireworks", name: "Fireworks AI" },
    { slug: "google-ai", name: "Google AI Studio" },
    { slug: "amazon-bedrock", name: "Amazon Bedrock" },
    { slug: "azure-ai", name: "Azure AI" },
    { slug: "deepinfra", name: "DeepInfra" },
  ];

  // Load compare selection from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oneatlas_compare");
      if (saved) {
        setSelectedForCompare(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Sync compare selection to localStorage
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

  const handleClearCompare = () => {
    setSelectedForCompare([]);
    try {
      localStorage.removeItem("oneatlas_compare");
    } catch {}
  };

  // Fetch live stats from /api/stats
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setStats(json.data);
          }
        }
      } catch (err) {
        console.warn("Could not load /api/stats:", err);
      }
    }
    loadStats();
  }, []);

  // Fetch models from /api/models with debouncing
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (selectedLab !== "all") params.set("lab", selectedLab);
        if (selectedProvider !== "all") params.set("provider", selectedProvider);
        if (selectedType !== "all") params.set("type", selectedType);

        // Capability params
        const caps = selectedCapabilities.filter(
          (c) => c !== "hide-deprecated" && c !== "open-weights"
        );
        if (caps.length > 0) {
          params.set("capability", caps.join(","));
        }
        if (selectedCapabilities.includes("open-weights")) {
          params.set("openWeights", "true");
        }
        if (selectedCapabilities.includes("hide-deprecated")) {
          params.set("hideDeprecated", "true");
        }

        params.set("sort", sortBy);
        params.set("order", sortOrder);
        params.set("page", currentPage.toString());
        params.set("limit", "20");

        const res = await fetch(`/api/models?${params.toString()}`);
        if (!isCancelled) {
          if (res.ok) {
            const json = await res.json();
            if (json.success) {
              setModels(json.data || []);
              if (json.pagination) {
                setTotalPages(json.pagination.totalPages || 1);
                setTotalCount(json.pagination.total || 0);
              }
            }
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch models:", err);
          setIsLoading(false);
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    selectedLab,
    selectedProvider,
    selectedType,
    selectedCapabilities,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const toggleCapability = (cap: string) => {
    setCurrentPage(1);
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLab("all");
    setSelectedProvider("all");
    setSelectedType("all");
    setSelectedCapabilities([]);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // Model details for compare tray
  const selectedModelsData = useMemo(() => {
    return selectedForCompare.map((id) => {
      const found = models.find((m) => m.id === id);
      return {
        id,
        name: found ? found.name : "Model",
        slug: found ? found.slug : id,
      };
    });
  }, [selectedForCompare, models]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section & Stats Panel */}
      <HeroSection stats={stats} />

      {/* 2. Search, Filters, Capability chips & View toggle */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedLab={selectedLab}
        setSelectedLab={(l) => {
          setSelectedLab(l);
          setCurrentPage(1);
        }}
        selectedProvider={selectedProvider}
        setSelectedProvider={(p) => {
          setSelectedProvider(p);
          setCurrentPage(1);
        }}
        selectedType={selectedType}
        setSelectedType={(t) => {
          setSelectedType(t);
          setCurrentPage(1);
        }}
        selectedCapabilities={selectedCapabilities}
        toggleCapability={toggleCapability}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalModels={stats.totalModels}
        filteredCount={totalCount || models.length}
        onClearFilters={handleClearFilters}
        labs={labsList}
        providers={providersList}
      />

      {/* 3. Main Data Content: Table or Cards view */}
      {viewMode === "table" ? (
        <ModelTable
          models={models}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          selectedForCompare={selectedForCompare}
          onToggleCompare={handleToggleCompare}
        />
      ) : (
        <ModelCards
          models={models}
          isLoading={isLoading}
          selectedForCompare={selectedForCompare}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs font-mono text-[#77736C]">
          <div>
            Page {currentPage} of {totalPages} ({totalCount} total)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded border border-[#E7E2D9] bg-white px-2.5 py-1 text-[#171717] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded border border-[#E7E2D9] bg-white px-2.5 py-1 text-[#171717] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Floating Compare Tray */}
      <CompareTray
        selectedModels={selectedModelsData}
        onRemove={handleToggleCompare}
        onClear={handleClearCompare}
      />
    </div>
  );
}
