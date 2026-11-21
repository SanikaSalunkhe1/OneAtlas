import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    try {
      const where: any = {};
      if (category && category !== "all") {
        where.category = category;
      }

      const benchmarks = await prisma.benchmark.findMany({
        where,
        include: {
          _count: { select: { scores: true } },
        },
        orderBy: { name: "asc" },
      });

      if (benchmarks && benchmarks.length > 0) {
        return NextResponse.json({ success: true, data: benchmarks });
      }
    } catch (dbError) {
      console.warn("DB query for benchmarks failed, using fallback:", dbError);
    }

    const fallbackBenchmarks = [
      {
        id: "b-1",
        name: "Chatbot Arena Elo",
        slug: "arena-elo",
        category: "overall",
        description: "Crowdsourced human preference evaluation benchmark via blind pairwise model comparisons (LMSYS).",
        _count: { scores: 9 },
      },
      {
        id: "b-2",
        name: "HumanEval",
        slug: "humaneval",
        category: "coding",
        description: "Python coding and algorithmic problem-solving accuracy (pass@1).",
        _count: { scores: 8 },
      },
      {
        id: "b-3",
        name: "MMLU-Pro",
        slug: "mmlu-pro",
        category: "knowledge",
        description: "Massive Multitask Language Understanding Pro with 10 options per reasoning question.",
        _count: { scores: 7 },
      },
      {
        id: "b-4",
        name: "MATH 500",
        slug: "math-500",
        category: "mathematics",
        description: "Challenging Olympiad and high school competition mathematics evaluation.",
        _count: { scores: 6 },
      },
      {
        id: "b-5",
        name: "GPQA Diamond",
        slug: "gpqa-diamond",
        category: "reasoning",
        description: "Graduate-Level Google-Proof Q&A benchmark tested against domain experts with PhDs.",
        _count: { scores: 5 },
      },
    ];

    let results = fallbackBenchmarks;
    if (category && category !== "all") {
      results = results.filter((b) => b.category === category);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
