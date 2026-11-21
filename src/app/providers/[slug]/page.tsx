"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Zap,
  Globe,
  Plus,
  Check,
  DollarSign,
} from "lucide-react";
import { formatContext, formatPrice } from "@/lib/utils";

export default function ProviderDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

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
    if (!slug) return;
    setIsLoading(true);

    fetch(`/api/providers/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Provider not found");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setProvider(json.data);
        } else {
          setError(json.error || "Provider not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 animate-pulse">
        <div className="h-4 bg-[#E5DDD0]/60 rounded w-32" />
        <div className="h-10 bg-[#E5DDD0]/60 rounded w-1/2" />
        <div className="h-32 bg-white rounded-xl border border-[#E7E2D9]" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#171717]">Provider Not Found</h2>
        <p className="text-sm text-[#77736C]">
          The API provider &quot;{slug}&quot; could not be found.
        </p>
        <Link
          href="/providers"
          className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Providers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back link */}
      <div className="pt-2">
        <Link
          href="/providers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77736C] hover:text-[#171717]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Providers
        </Link>
      </div>

      {/* Provider Header Card */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FAF9F6] border border-[#E7E2D9] text-lg font-bold text-[#171717]">
              {provider.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-[#171717] tracking-tight">
                {provider.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#77736C] font-mono mt-1">
                <span>⚡ {provider.models?.length || 0} Supported Models</span>
                {provider.website && (
                  <>
                    <span>·</span>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#171717] hover:underline"
                    >
                      <Globe className="h-3 w-3" /> Website <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#77736C] leading-relaxed max-w-3xl">
          {provider.description ||
            `Frontier AI infrastructure and API access platform with enterprise routing and low latency.`}
        </p>
      </div>

      {/* Supported Models & Pricing Tiers */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Supported Models & Provider Pricing
          </h2>
          <span className="text-xs text-[#77736C] font-mono">Rates per 1M tokens</span>
        </div>

        {provider.models && provider.models.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase text-[#77736C]">
                  <th className="py-2.5 px-3">MODEL</th>
                  <th className="py-2.5 px-3">LAB</th>
                  <th className="py-2.5 px-3 text-right">CONTEXT</th>
                  <th className="py-2.5 px-3 text-right">INPUT / 1M</th>
                  <th className="py-2.5 px-3 text-right">OUTPUT / 1M</th>
                  <th className="py-2.5 px-3 text-right">CACHED / 1M</th>
                  <th className="py-2.5 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {provider.models.map((item: any) => {
                  const m = item.model || item;
                  const isSelected = selectedForCompare.includes(m.id);

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-3">
                        <Link
                          href={`/models/${m.slug}`}
                          className="font-semibold text-[#171717] hover:underline"
                        >
                          {m.name}
                        </Link>
                        <div className="text-[11px] font-mono text-[#77736C]">
                          {m.modelId}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#77736C]">
                        {m.company?.name}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#171717]">
                        {formatContext(m.contextLength)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#171717]">
                        {formatPrice(item.inputPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#171717]">
                        {formatPrice(item.outputPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#77736C]">
                        {formatPrice(item.cachePrice)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleCompare(m.id)}
                            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                              isSelected
                                ? "bg-[#171717] text-white"
                                : "border border-[#E7E2D9] text-[#171717] hover:bg-white"
                            }`}
                          >
                            {isSelected ? "Compared" : "Compare"}
                          </button>
                          <Link
                            href={`/models/${m.slug}`}
                            className="rounded border border-[#E7E2D9] px-2 py-1 text-xs font-medium text-[#171717] hover:bg-white"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#77736C]">No model pricing listings available for this provider.</p>
        )}
      </div>
    </div>
  );
}
