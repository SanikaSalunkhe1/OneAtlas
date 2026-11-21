import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_MODELS } from "@/lib/catalogData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "overall";
    const q = searchParams.get("q");

    const categoryBenchmarkMap: Record<string, string> = {
      overall: "arena-elo",
      reasoning: "gpqa-diamond",
      coding: "humaneval",
      mathematics: "math-500",
      knowledge: "mmlu-pro",
    };

    const targetBenchmarkSlug = categoryBenchmarkMap[category.toLowerCase()] || "arena-elo";

    try {
      const benchmark = await prisma.benchmark.findUnique({
        where: { slug: targetBenchmarkSlug },
      });

      if (benchmark) {
        const where: any = { benchmarkId: benchmark.id };
        if (q && q.trim()) {
          where.model = {
            name: { contains: q.trim(), mode: "insensitive" },
          };
        }

        const modelBenchmarks = await prisma.modelBenchmark.findMany({
          where,
          include: {
            model: {
              include: {
                company: true,
                providers: { include: { provider: true } },
              },
            },
            benchmark: true,
          },
          orderBy: { score: "desc" },
        });

        if (modelBenchmarks.length > 0) {
          const rankings = modelBenchmarks.map((item, index) => ({
            rank: index + 1,
            modelId: item.model.id,
            name: item.model.name,
            slug: item.model.slug,
            company: item.model.company,
            modelType: item.model.modelType,
            openWeights: item.model.openWeights,
            releasedAt: item.model.releasedAt,
            score: item.score,
            benchmarkName: benchmark.name,
            category: benchmark.category,
            source: item.source,
            isDemo: item.isDemo,
            providersCount: item.model.providers.length,
          }));

          return NextResponse.json({
            success: true,
            data: { category, benchmark, rankings },
          });
        }
      }
    } catch (dbError) {
      console.warn("DB query for rankings failed, using fallback:", dbError);
    }

    // Fallback rankings from INITIAL_MODELS
    const benchmarkLabels: Record<string, string> = {
      "arena-elo": "Chatbot Arena Elo",
      "gpqa-diamond": "GPQA Diamond",
      "humaneval": "HumanEval",
      "math-500": "MATH 500",
      "mmlu-pro": "MMLU-Pro",
    };

    let matched = INITIAL_MODELS.map((m) => {
      const bScore = m.benchmarks.find(
        (b) => b.benchmark.slug === targetBenchmarkSlug
      )?.score;
      return {
        modelId: m.id,
        name: m.name,
        slug: m.slug,
        company: m.company,
        modelType: m.modelType,
        openWeights: m.openWeights,
        releasedAt: m.releasedAt,
        score: bScore || 0,
        benchmarkName: benchmarkLabels[targetBenchmarkSlug] || "Benchmark",
        category,
        source: "OneAtlas Verified Benchmark",
        isDemo: false,
        providersCount: m.providers.length,
      };
    }).filter((m) => m.score > 0);

    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      matched = matched.filter((m) => m.name.toLowerCase().includes(search));
    }

    matched.sort((a, b) => b.score - a.score);

    const rankings = matched.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      data: {
        category,
        benchmark: {
          name: benchmarkLabels[targetBenchmarkSlug] || "Benchmark",
          slug: targetBenchmarkSlug,
          category,
        },
        rankings,
      },
    });
  } catch (error: any) {
    console.error("GET /api/rankings error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
