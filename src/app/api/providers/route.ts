import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_MODELS } from "@/lib/catalogData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    try {
      const where: any = {};
      if (q && q.trim()) {
        where.OR = [
          { name: { contains: q.trim(), mode: "insensitive" } },
          { description: { contains: q.trim(), mode: "insensitive" } },
        ];
      }

      const providers = await prisma.provider.findMany({
        where,
        include: {
          _count: { select: { models: true } },
        },
        orderBy: { models: { _count: "desc" } },
      });

      if (providers && providers.length > 0) {
        return NextResponse.json({ success: true, data: providers });
      }
    } catch (dbError) {
      console.warn("DB query for providers failed, using fallback:", dbError);
    }

    const providerMap = new Map<string, any>();
    for (const m of INITIAL_MODELS) {
      for (const p of m.providers) {
        if (!providerMap.has(p.provider.slug)) {
          providerMap.set(p.provider.slug, {
            id: p.provider.id,
            name: p.provider.name,
            slug: p.provider.slug,
            description: `Inference and API access provider hosting ${p.provider.name} models.`,
            website: `https://${p.provider.slug}.ai`,
            _count: { models: 1 },
          });
        } else {
          providerMap.get(p.provider.slug)._count.models += 1;
        }
      }
    }

    let providers = Array.from(providerMap.values());
    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      providers = providers.filter((p) => p.name.toLowerCase().includes(search));
    }

    return NextResponse.json({ success: true, data: providers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
