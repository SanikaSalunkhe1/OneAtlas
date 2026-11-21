import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatsPanel } from "./StatsPanel";

interface HeroSectionProps {
  stats: {
    totalModels: number;
    totalLabs: number;
    totalProviders: number;
    totalListings: number;
    releasesPerMonth?: { month: string; count: number }[];
    capabilityCoverage?: {
      toolCalling: number;
      reasoning: number;
      vision: number;
      openWeights: number;
    };
  };
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-2 pb-6">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif tracking-tight text-[#171717] leading-[1.1]">
          Every AI model, compared.
        </h1>
        <p className="text-base sm:text-lg text-[#77736C] max-w-xl leading-relaxed">
          Specs, pricing, capabilities, and providers in one place. Sort any column, filter to what you need, and open a model for the full record.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            href="/rankings"
            className="rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-all shadow-sm"
          >
            See rankings
          </Link>
          <Link
            href="/benchmarks"
            className="rounded-lg border border-[#E7E2D9] bg-white px-4 py-2.5 text-sm font-medium text-[#171717] hover:bg-[#F2ECE1] transition-all shadow-sm"
          >
            Benchmarks
          </Link>
          <Link
            href="/labs"
            className="flex items-center gap-1.5 text-sm font-medium text-[#171717] hover:text-[#77736C] transition-colors px-2 py-2.5"
          >
            Browse labs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <StatsPanel stats={stats} />
    </div>
  );
}
