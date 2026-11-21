import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_MODELS } from "@/lib/catalogData";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    try {
      const model = await prisma.model.findUnique({
        where: { slug },
        include: {
          company: true,
          providers: {
            include: { provider: true },
            orderBy: { inputPrice: "asc" },
          },
          capabilities: {
            include: { capability: true },
          },
          benchmarks: {
            include: { benchmark: true },
            orderBy: { benchmark: { category: "asc" } },
          },
        },
      });

      if (model) {
        return NextResponse.json({ success: true, data: model });
      }
    } catch (dbError) {
      console.warn("DB query failed, checking fallback:", dbError);
    }

    const fallbackModel = INITIAL_MODELS.find((m) => m.slug === slug);
    if (!fallbackModel) {
      return NextResponse.json(
        { success: false, error: `Model not found with slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fallbackModel });
  } catch (error: any) {
    console.error(`GET /api/models/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
