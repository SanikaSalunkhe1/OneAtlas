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
      const provider = await prisma.provider.findUnique({
        where: { slug },
        include: {
          models: {
            include: {
              model: {
                include: {
                  company: true,
                  capabilities: {
                    include: { capability: true },
                  },
                },
              },
            },
            orderBy: { inputPrice: "asc" },
          },
          _count: {
            select: { models: true },
          },
        },
      });

      if (provider) {
        return NextResponse.json({ success: true, data: provider });
      }
    } catch (dbError) {
      console.warn("DB query for provider detail failed, using fallback:", dbError);
    }

    // Fallback from INITIAL_MODELS
    const supportedModels: any[] = [];
    let providerInfo: any = null;

    for (const m of INITIAL_MODELS) {
      const foundProv = m.providers.find((p) => p.provider.slug === slug);
      if (foundProv) {
        if (!providerInfo) {
          providerInfo = {
            id: foundProv.provider.id,
            name: foundProv.provider.name,
            slug: foundProv.provider.slug,
            description: `Global AI cloud inference platform serving high-speed API access to frontier models.`,
            website: `https://${slug}.com`,
          };
        }
        supportedModels.push({
          id: foundProv.id,
          inputPrice: foundProv.inputPrice,
          outputPrice: foundProv.outputPrice,
          cachePrice: foundProv.cachePrice,
          availability: "available",
          model: m,
        });
      }
    }

    if (!providerInfo) {
      return NextResponse.json(
        { success: false, error: `Provider not found with slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...providerInfo,
        models: supportedModels,
        _count: { models: supportedModels.length },
      },
    });
  } catch (error: any) {
    console.error(`GET /api/providers/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
