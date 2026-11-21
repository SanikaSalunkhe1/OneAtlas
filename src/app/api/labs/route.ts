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

      const labs = await prisma.company.findMany({
        where,
        include: {
          _count: { select: { models: true } },
        },
        orderBy: { models: { _count: "desc" } },
      });

      if (labs && labs.length > 0) {
        return NextResponse.json({ success: true, data: labs });
      }
    } catch (dbError) {
      console.warn("DB query for labs failed, using fallback:", dbError);
    }

    // Fallback labs extracted from models
    const labMap = new Map<string, any>();
    for (const m of INITIAL_MODELS) {
      if (!labMap.has(m.company.slug)) {
        labMap.set(m.company.slug, {
          id: m.company.id,
          name: m.company.name,
          slug: m.company.slug,
          description: `Frontier research lab developing foundational models like ${m.name}.`,
          website: `https://${m.company.slug}.com`,
          _count: { models: 1 },
        });
      } else {
        labMap.get(m.company.slug)._count.models += 1;
      }
    }

    let labs = Array.from(labMap.values());
    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      labs = labs.filter((l) => l.name.toLowerCase().includes(search));
    }

    return NextResponse.json({ success: true, data: labs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
