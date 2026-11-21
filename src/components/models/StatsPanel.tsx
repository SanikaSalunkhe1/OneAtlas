"use client";

interface StatsPanelProps {
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

export function StatsPanel({ stats }: StatsPanelProps) {
  const releases = stats.releasesPerMonth || [
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
  ];

  const maxCount = Math.max(...releases.map((r) => r.count), 100);

  const coverage = stats.capabilityCoverage || {
    toolCalling: 66,
    reasoning: 50,
    vision: 58,
    openWeights: 45,
  };

  return (
    <div className="w-full lg:w-[480px] shrink-0 rounded-2xl bg-[#E5DDD0] p-6 border border-[#D5CEBF] shadow-sm space-y-6">
      {/* 4 Metrics Header */}
      <div className="grid grid-cols-4 gap-2 text-left">
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#171717] font-mono">
            {stats.totalModels.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#77736C] font-medium tracking-wide">
            Models
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#171717] font-mono">
            {stats.totalLabs.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#77736C] font-medium tracking-wide">
            Labs
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#171717] font-mono">
            {stats.totalProviders.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#77736C] font-medium tracking-wide">
            Providers
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#171717] font-mono">
            {stats.totalListings.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#77736C] font-medium tracking-wide">
            API listings
          </div>
        </div>
      </div>

      {/* 2 Inner Subcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Releases per month */}
        <div className="rounded-xl bg-[#FAF9F6] p-4 border border-[#DDD4C4] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#171717]">Releases per month</span>
            <span className="text-[10px] text-[#77736C] font-mono">598 in 12 mo</span>
          </div>

          <div className="h-20 flex items-end gap-1 pt-2">
            {releases.map((item, idx) => {
              const heightPct = Math.round((item.count / maxCount) * 100);
              return (
                <div
                  key={idx}
                  title={`${item.month}: ${item.count} releases`}
                  className="flex-1 bg-[#8C8476] rounded-t-sm hover:bg-[#171717] transition-all cursor-pointer"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[9px] font-mono text-[#77736C] pt-1">
            <span>Dec 25</span>
            <span>Nov 26</span>
          </div>
        </div>

        {/* Capability coverage */}
        <div className="rounded-xl bg-[#FAF9F6] p-4 border border-[#DDD4C4] space-y-3">
          <div className="text-xs font-semibold text-[#171717]">Capability coverage</div>

          <div className="space-y-2.5 pt-1">
            <div>
              <div className="flex justify-between text-[11px] text-[#171717] font-medium mb-1">
                <span>Tool calling</span>
                <span className="font-mono text-[#77736C]">{coverage.toolCalling}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E5DDD0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#171717] rounded-full"
                  style={{ width: `${coverage.toolCalling}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#171717] font-medium mb-1">
                <span>Reasoning</span>
                <span className="font-mono text-[#77736C]">{coverage.reasoning}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E5DDD0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#171717] rounded-full"
                  style={{ width: `${coverage.reasoning}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#171717] font-medium mb-1">
                <span>Vision input</span>
                <span className="font-mono text-[#77736C]">{coverage.vision}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E5DDD0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#171717] rounded-full"
                  style={{ width: `${coverage.vision}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#171717] font-medium mb-1">
                <span>Open weights</span>
                <span className="font-mono text-[#77736C]">{coverage.openWeights}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E5DDD0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#171717] rounded-full"
                  style={{ width: `${coverage.openWeights}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
