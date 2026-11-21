"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, BarChart3, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BenchmarkDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [benchmark, setBenchmark] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    fetch(`/api/benchmarks/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Benchmark not found");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setBenchmark(json.data);
        } else {
          setError(json.error || "Benchmark not found");
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
        <div className="h-40 bg-white rounded-xl border border-[#E7E2D9]" />
      </div>
    );
  }

  if (error || !benchmark) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#171717]">Benchmark Not Found</h2>
        <p className="text-sm text-[#77736C]">
          The benchmark &quot;{slug}&quot; could not be found in the catalog.
        </p>
        <Link
          href="/benchmarks"
          className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all benchmarks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <div className="pt-2">
        <Link
          href="/benchmarks"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77736C] hover:text-[#171717]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Benchmarks
        </Link>
      </div>

      {/* Benchmark Header */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[#FAF9F6] border border-[#E7E2D9] px-3 py-1 text-xs font-mono font-medium text-[#171717] capitalize">
            {benchmark.category}
          </span>
          <span className="text-xs font-mono text-[#77736C]">
            {benchmark.scores?.length || 0} Models Evaluated
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#171717]">
          {benchmark.name}
        </h1>

        <p className="text-sm text-[#77736C] max-w-3xl leading-relaxed">
          {benchmark.description}
        </p>
      </div>

      {/* Leaderboard Table for this Benchmark */}
      <div className="rounded-2xl border border-[#E7E2D9] bg-white shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Participating Models & Verified Scores
          </h2>
          <span className="text-xs text-[#77736C] font-mono">Ranked by Score</span>
        </div>

        {benchmark.scores && benchmark.scores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E2D9] bg-[#FAF9F6] text-[10px] font-mono uppercase text-[#77736C]">
                  <th className="py-2.5 px-3 w-16 text-center">RANK</th>
                  <th className="py-2.5 px-3">MODEL</th>
                  <th className="py-2.5 px-3">LAB</th>
                  <th className="py-2.5 px-3 text-right">SCORE</th>
                  <th className="py-2.5 px-3">EVALUATION SOURCE</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {benchmark.scores.map((s: any, idx: number) => {
                  return (
                    <tr key={s.id || idx} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#171717]">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#171717]">
                        <Link
                          href={`/models/${s.model?.slug}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {s.model?.name}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-[#77736C]">
                        {s.model?.company?.name}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-sm text-[#171717] text-right">
                        {s.score}
                      </td>
                      <td className="py-3 px-3 text-[#77736C]">
                        {s.source || "Official Benchmark"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/models/${s.model?.slug}`}
                          className="rounded border border-[#E7E2D9] px-2.5 py-1 text-xs font-medium text-[#171717] hover:bg-white"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#77736C]">No scores found for this benchmark.</p>
        )}
      </div>
    </div>
  );
}
