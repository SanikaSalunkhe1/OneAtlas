"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Layers,
  Plus,
  ShieldCheck,
  Sparkles,
  Zap,
  Cpu,
  BarChart3,
  DollarSign,
  Calendar,
  Code,
} from "lucide-react";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    fetch(`/api/models/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Model not found");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setModel(json.data);
          // Check compare status
          try {
            const saved = localStorage.getItem("oneatlas_compare");
            if (saved) {
              const list: string[] = JSON.parse(saved);
              setIsInCompare(list.includes(json.data.id));
            }
          } catch {}
        } else {
          setError(json.error || "Model not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const toggleCompare = () => {
    if (!model) return;
    try {
      const saved = localStorage.getItem("oneatlas_compare");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(model.id)) {
        list = list.filter((id) => id !== model.id);
        setIsInCompare(false);
      } else {
        if (list.length >= 3) {
          alert("You can compare up to 3 models at a time.");
          return;
        }
        list.push(model.id);
        setIsInCompare(true);
      }
      localStorage.setItem("oneatlas_compare", JSON.stringify(list));
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 animate-pulse">
        <div className="h-4 bg-[#E5DDD0]/60 rounded w-32" />
        <div className="h-10 bg-[#E5DDD0]/60 rounded w-2/3" />
        <div className="h-32 bg-white rounded-xl border border-[#E7E2D9] p-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-xl border border-[#E7E2D9]" />
          <div className="h-64 bg-white rounded-xl border border-[#E7E2D9]" />
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#171717]">Model Not Found</h2>
        <p className="text-sm text-[#77736C]">
          The model you are looking for ({slug}) does not exist in the OneAtlas catalog.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all models
        </Link>
      </div>
    );
  }

  const primaryProvider = model.providers?.[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77736C] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Models
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCompare}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              isInCompare
                ? "bg-[#171717] text-white"
                : "border border-[#E7E2D9] bg-white text-[#171717] hover:bg-[#FAF9F6]"
            }`}
          >
            {isInCompare ? (
              <>
                <Check className="h-3.5 w-3.5" /> In Comparison
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Add to Compare
              </>
            )}
          </button>
          <Link
            href={`/compare?models=${model.slug}`}
            className="rounded-lg bg-[#E5DDD0] px-3.5 py-1.5 text-xs font-semibold text-[#171717] hover:bg-[#D5CEBF] transition-colors"
          >
            Compare View
          </Link>
        </div>
      </div>

      {/* Model Header Card */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Link
                href={`/labs/${model.company?.slug}`}
                className="text-xs font-semibold text-[#77736C] hover:text-[#171717] transition-colors"
              >
                {model.company?.name}
              </Link>
              <span className="text-[#A8A29E]">·</span>
              <span className="font-mono text-xs text-[#77736C]">{model.modelId}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#171717] tracking-tight">
              {model.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                model.openWeights
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-neutral-100 text-neutral-800 border border-neutral-200"
              }`}
            >
              {model.openWeights ? "Open Weights" : "Proprietary"}
            </span>
            <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-3 py-1 text-xs font-medium text-[#171717] capitalize">
              {model.modelType} Model
            </span>
            {model.deprecated && (
              <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-medium">
                Deprecated
              </span>
            )}
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#77736C] leading-relaxed max-w-3xl">
          {model.description ||
            "Frontier foundation model engineered for scalable intelligence, multi-turn reasoning, and production API workloads."}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#E7E2D9] text-xs font-mono text-[#77736C]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#171717]" />
            Released: {formatDate(model.releasedAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#171717]" />
            Updated: {formatDate(model.updatedAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#171717]" />
            Providers: {model.providers?.length || 1}
          </div>
        </div>
      </div>

      {/* Grid: Technical Specifications & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Specs */}
        <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Technical Specifications
          </h2>

          <div className="divide-y divide-[#E7E2D9] text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Context Window</span>
              <span className="font-mono font-semibold text-[#171717]">
                {model.contextLength?.toLocaleString()} tokens ({formatContext(model.contextLength)})
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Max Output Tokens</span>
              <span className="font-mono font-semibold text-[#171717]">
                {model.maxOutput?.toLocaleString()} tokens ({formatContext(model.maxOutput)})
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Input Modalities</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.inputModalities?.join(", ") || "Text"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Output Modalities</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.outputModalities?.join(", ") || "Text"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Reasoning / Chain of Thought</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.reasoning ? "Supported" : "Not supported"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Tool Calling / Functions</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.toolCalling ? "Supported" : "Not supported"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Structured JSON Output</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.structuredOutput ? "Supported" : "Not supported"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[#77736C]">Temperature Support</span>
              <span className="font-mono font-medium text-[#171717]">
                {model.supportsTemperature ? "Supported" : "Fixed / Restricted"}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Architecture */}
        <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Pricing & Token Economics
          </h2>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E2D9] text-center">
            <div>
              <div className="text-[10px] uppercase font-mono text-[#77736C]">Input / 1M</div>
              <div className="text-lg font-bold font-mono text-[#171717] mt-1">
                {formatPrice(primaryProvider?.inputPrice)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#77736C]">Output / 1M</div>
              <div className="text-lg font-bold font-mono text-[#171717] mt-1">
                {formatPrice(primaryProvider?.outputPrice)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#77736C]">Cached / 1M</div>
              <div className="text-lg font-bold font-mono text-[#171717] mt-1">
                {formatPrice(primaryProvider?.cachePrice)}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-[#171717]">
              Available Inference Providers ({model.providers?.length || 0})
            </div>
            <div className="divide-y divide-[#E7E2D9] text-xs">
              {model.providers && model.providers.length > 0 ? (
                model.providers.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/providers/${p.provider?.slug}`}
                      className="font-medium text-[#171717] hover:underline"
                    >
                      {p.provider?.name}
                    </Link>
                    <div className="font-mono text-[#77736C]">
                      {formatPrice(p.inputPrice)} in · {formatPrice(p.outputPrice)} out
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2 text-xs text-[#77736C]">Direct Lab API</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Evaluations Table */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Benchmark Evaluations
          </h2>
          <span className="text-xs font-mono text-[#77736C]">Verified Scores</span>
        </div>

        {model.benchmarks && model.benchmarks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase text-[#77736C]">
                  <th className="py-2.5 px-3">Benchmark</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {model.benchmarks.map((b: any, idx: number) => {
                  const bName = b.benchmark?.name || b.benchmarkSlug;
                  const bCat = b.benchmark?.category || "Evaluation";
                  return (
                    <tr key={idx} className="hover:bg-[#FAF9F6]">
                      <td className="py-2.5 px-3 font-semibold text-[#171717]">{bName}</td>
                      <td className="py-2.5 px-3 font-mono text-[#77736C] capitalize">{bCat}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#171717] text-right">
                        {b.score}
                      </td>
                      <td className="py-2.5 px-3 text-[#77736C]">{b.source || "Official Evaluation"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#77736C]">No benchmark evaluations recorded yet for this model.</p>
        )}
      </div>
    </div>
  );
}
