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
      const lab = await prisma.company.findUnique({
        where: { slug },
        include: {
          models: {
            include: {
              providers: {
                include: { provider: true },
              },
              capabilities: {
                include: { capability: true },
              },
              benchmarks: {
                include: { benchmark: true },
              },
            },
            orderBy: { updatedAt: "desc" },
          },
          _count: {
            select: { models: true },
          },
        },
      });

      if (lab) {
        return NextResponse.json({ success: true, data: lab });
      }
    } catch (dbError) {
      console.warn("DB query for lab detail failed, using fallback:", dbError);
    }

    // Fallback from INITIAL_MODELS
    const matchingModels = INITIAL_MODELS.filter((m) => m.company.slug === slug);
    if (matchingModels.length === 0) {
      // Check if slug matches any known company
      const knownCompanies: Record<string, any> = {
        openai: { name: "OpenAI", website: "https://openai.com", description: "Pioneer in artificial general intelligence research and creator of GPT-4o, o1, and ChatGPT." },
        anthropic: { name: "Anthropic", website: "https://anthropic.com", description: "AI safety and research company, creators of Claude 3.5 Sonnet, Claude 3.5 Haiku, and Claude 3 Opus." },
        google: { name: "Google DeepMind", website: "https://deepmind.google", description: "Frontier AI research lab behind Gemini 1.5 Pro, Gemini 1.5 Flash, and Gemma open models." },
        deepseek: { name: "DeepSeek", website: "https://deepseek.com", description: "Frontier open-weights research lab specializing in cost-efficient reasoning, math, and coding models like DeepSeek V3 and R1." },
        meta: { name: "Meta AI", website: "https://ai.meta.com", description: "Open source foundation model research lab developing the Llama 3 family of open weights models." },
        mistral: { name: "Mistral AI", website: "https://mistral.ai", description: "European frontier lab providing both open weights and high-performance commercial models like Mistral Large 2." },
        alibaba: { name: "Alibaba Cloud", website: "https://aliyun.com", description: "Creator of Qwen 2.5 open foundation and coder models supporting up to 128k context and high multilingual performance." },
        xai: { name: "xAI", website: "https://x.ai", description: "AI research lab founded by Elon Musk developing Grok 2 and frontier reasoning systems." },
      };

      const found = knownCompanies[slug];
      if (!found) {
        return NextResponse.json(
          { success: false, error: `Lab not found with slug: ${slug}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: `c-${slug}`,
          slug,
          name: found.name,
          website: found.website,
          description: found.description,
          models: [],
          _count: { models: 0 },
        },
      });
    }

    const first = matchingModels[0];
    const lab = {
      id: first.company.id,
      name: first.company.name,
      slug: first.company.slug,
      website: `https://${first.company.slug}.com`,
      description: `Frontier research lab developing leading foundational AI models like ${first.name}.`,
      models: matchingModels,
      _count: { models: matchingModels.length },
    };

    return NextResponse.json({ success: true, data: lab });
  } catch (error: any) {
    console.error(`GET /api/labs/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
