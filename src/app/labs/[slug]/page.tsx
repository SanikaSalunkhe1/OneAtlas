"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  Calendar,
  Globe,
  Plus,
  Check,
} from "lucide-react";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

export default function LabDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lab, setLab] = useState<any>(null);
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

    fetch(`/api/labs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lab not found");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setLab(json.data);
        } else {
          setError(json.error || "Lab not found");
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

  if (error || !lab) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#171717]">Lab Not Found</h2>
        <p className="text-sm text-[#77736C]">
          The research lab &quot;{slug}&quot; could not be found.
        </p>
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Labs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back link */}
      <div className="pt-2">
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77736C] hover:text-[#171717]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Labs Directory
        </Link>
      </div>

      {/* Lab Header Profile */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FAF9F6] border border-[#E7E2D9] text-lg font-bold text-[#171717]">
              {lab.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-[#171717] tracking-tight">
                {lab.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#77736C] font-mono mt-1">
                <span>{lab._count?.models || lab.models?.length || 0} Models in Catalog</span>
                {lab.website && (
                  <>
                    <span>·</span>
                    <a
                      href={lab.website}
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
          {lab.description ||
            `Frontier artificial intelligence laboratory creating cutting-edge foundation models.`}
        </p>
      </div>

      {/* Models by this Lab */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <Layers className="h-4 w-4" /> Developed AI Models ({lab.models?.length || 0})
          </h2>
          <span className="text-xs text-[#77736C] font-mono">Frontier Catalog</span>
        </div>

        {lab.models && lab.models.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase text-[#77736C]">
                  <th className="py-2.5 px-3">MODEL</th>
                  <th className="py-2.5 px-3">TYPE</th>
                  <th className="py-2.5 px-3 text-right">CONTEXT</th>
                  <th className="py-2.5 px-3 text-right">INPUT / 1M</th>
                  <th className="py-2.5 px-3 text-right">OUTPUT / 1M</th>
                  <th className="py-2.5 px-3 text-center">WEIGHTS</th>
                  <th className="py-2.5 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {lab.models.map((m: any) => {
                  const inputPrice = m.providers?.[0]?.inputPrice;
                  const outputPrice = m.providers?.[0]?.outputPrice;
                  const isSelected = selectedForCompare.includes(m.id);

                  return (
                    <tr key={m.id} className="hover:bg-[#FAF9F6]">
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
                      <td className="py-3 px-3 capitalize font-mono text-[#77736C]">
                        {m.modelType}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#171717]">
                        {formatContext(m.contextLength)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#171717]">
                        {formatPrice(inputPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#171717]">
                        {formatPrice(outputPrice)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            m.openWeights
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                          }`}
                        >
                          {m.openWeights ? "Open" : "Closed"}
                        </span>
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
          <p className="text-xs text-[#77736C]">No models found for this research lab.</p>
        )}
      </div>
    </div>
  );
}
