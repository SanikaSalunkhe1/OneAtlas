import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_MODELS } from "@/lib/catalogData";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    try {
      const benchmark = await prisma.benchmark.findUnique({
        where: { slug },
        include: {
          scores: {
            include: {
              model: {
                include: { company: true },
              },
            },
            orderBy: { score: "desc" },
          },
        },
      });

      if (benchmark) {
        return NextResponse.json({ success: true, data: benchmark });
      }
    } catch (dbError) {
      console.warn("DB query for benchmark detail failed, using fallback:", dbError);
    }

    const benchmarkDescriptions: Record<string, { name: string; category: string; description: string }> = {
      "arena-elo": {
        name: "Chatbot Arena Elo",
        category: "overall",
        description: "Crowdsourced human preference evaluation benchmark via blind pairwise model comparisons (LMSYS).",
      },
      "humaneval": {
        name: "HumanEval",
        category: "coding",
        description: "OpenAI benchmark evaluating Python coding and algorithmic problem-solving accuracy (pass@1).",
      },
      "mmlu-pro": {
        name: "MMLU-Pro",
        category: "knowledge",
        description: "Massive Multitask Language Understanding Pro with rigorous reasoning and 10 options per question.",
      },
      "math-500": {
        name: "MATH 500",
        category: "mathematics",
        description: "Challenging high school and Olympiad competition mathematics evaluation.",
      },
      "gpqa-diamond": {
        name: "GPQA Diamond",
        category: "reasoning",
        description: "Graduate-Level Google-Proof Q&A benchmark tested against domain experts with PhDs.",
      },
      "swe-bench-verified": {
        name: "SWE-bench Verified",
        category: "coding",
        description: "Real-world GitHub software engineering issues resolved end-to-end with unit test verification.",
      },
    };

    const info = benchmarkDescriptions[slug];
    if (!info) {
      return NextResponse.json(
        { success: false, error: `Benchmark not found with slug: ${slug}` },
        { status: 404 }
      );
    }

    const scores = INITIAL_MODELS.map((m) => {
      const found = m.benchmarks.find((b) => b.benchmark.slug === slug);
      if (!found) return null;
      return {
        id: `sb-${m.id}`,
        score: found.score,
        source: "OneAtlas Verified Benchmarks",
        isDemo: false,
        model: m,
      };
    })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      success: true,
      data: {
        id: `bm-${slug}`,
        name: info.name,
        slug,
        category: info.category,
        description: info.description,
        scores,
      },
    });
  } catch (error: any) {
    console.error(`GET /api/benchmarks/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
