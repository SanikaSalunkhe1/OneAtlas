import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_MODELS } from "@/lib/catalogData";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  q: z.string().optional(),
  lab: z.string().optional(),
  provider: z.string().optional(),
  type: z.string().optional(),
  capability: z.string().optional(),
  openWeights: z.string().optional(),
  hideDeprecated: z.string().optional(),
  sort: z.string().optional().default("updatedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = querySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { q, lab, provider, type, capability, openWeights, hideDeprecated, sort, order, page, limit } = parsed.data;

    // 1. Try Prisma first
    try {
      const where: any = {};

      if (hideDeprecated === "true" || hideDeprecated === "1") {
        where.deprecated = false;
      }

      if (openWeights === "true") {
        where.openWeights = true;
      } else if (openWeights === "false") {
        where.openWeights = false;
      }

      if (type && type !== "all") {
        where.modelType = type;
      }

      if (lab && lab !== "all") {
        where.company = { slug: lab };
      }

      if (provider && provider !== "all") {
        where.providers = {
          some: {
            provider: { slug: provider },
          },
        };
      }

      if (capability && capability !== "all") {
        const caps = capability.split(",").map((c) => c.trim().toLowerCase());
        where.capabilities = {
          some: {
            capability: { slug: { in: caps } },
          },
        };
      }

      if (q && q.trim().length > 0) {
        const search = q.trim();
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { modelId: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { company: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      let orderBy: any = {};
      if (sort === "name") {
        orderBy = { name: order };
      } else if (sort === "releasedAt") {
        orderBy = { releasedAt: order };
      } else if (sort === "contextLength") {
        orderBy = { contextLength: order };
      } else {
        orderBy = { updatedAt: order };
      }

      const skip = (page - 1) * limit;

      const [total, models] = await Promise.all([
        prisma.model.count({ where }),
        prisma.model.findMany({
          where,
          include: {
            company: true,
            providers: {
              include: {
                provider: true,
              },
            },
            capabilities: {
              include: {
                capability: true,
              },
            },
            benchmarks: {
              include: {
                benchmark: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
      ]);

      if (models && models.length > 0) {
        return NextResponse.json({
          success: true,
          data: models,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      }
    } catch (dbError) {
      console.warn("Database query failed, gracefully using resilient catalog fallback:", dbError);
    }

    // 2. Resilient In-Memory Fallback if database is unavailable or unseeded
    let filtered = [...INITIAL_MODELS];

    if (hideDeprecated === "true" || hideDeprecated === "1") {
      filtered = filtered.filter((m) => !m.deprecated);
    }

    if (openWeights === "true") {
      filtered = filtered.filter((m) => m.openWeights);
    } else if (openWeights === "false") {
      filtered = filtered.filter((m) => !m.openWeights);
    }

    if (type && type !== "all") {
      filtered = filtered.filter((m) => m.modelType === type);
    }

    if (lab && lab !== "all") {
      filtered = filtered.filter((m) => m.company.slug === lab);
    }

    if (provider && provider !== "all") {
      filtered = filtered.filter((m) =>
        m.providers.some((p) => p.provider.slug === provider)
      );
    }

    if (capability && capability !== "all") {
      const caps = capability.split(",").map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((m) => {
        // Special case for 1m-context and free
        if (caps.includes("1m-context") && (m.contextLength || 0) < 1000000) {
          return false;
        }
        if (caps.includes("free") && !m.providers.some(p => (p.inputPrice || 0) === 0)) {
          const hasFreeCap = m.capabilities.some(c => c.capability.slug === "free");
          if (!hasFreeCap) return false;
        }
        const remainingCaps = caps.filter(c => c !== "1m-context" && c !== "free");
        if (remainingCaps.length === 0) return true;
        return m.capabilities.some((c) => remainingCaps.includes(c.capability.slug));
      });
    }

    if (q && q.trim().length > 0) {
      const search = q.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.modelId.toLowerCase().includes(search) ||
          m.company.name.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let valA: any = a[sort as keyof typeof a] ?? a.updatedAt;
      let valB: any = b[sort as keyof typeof b] ?? b.updatedAt;
      if (sort === "price") {
        valA = a.providers[0]?.inputPrice ?? 9999;
        valB = b.providers[0]?.inputPrice ?? 9999;
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("GET /api/models error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
