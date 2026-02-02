import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ feature_key: string }> }) {
  try {
    requireSuperAdmin(req as any);

    const { feature_key } = await ctx.params;

    const body = await req.json();
    const { enabled } = body || {};

    if (typeof enabled !== "boolean") {
      return NextResponse.json({ error: "enabled must be boolean" }, { status: 400 });
    }

    const updated = await prisma.systemFeature.update({
      where: { feature_key },
      data: {
        enabled,
        updated_by: null,
      },
      select: {
        feature_key: true,
        enabled: true,
        updated_at: true,
        updated_by: true,
      },
    });

    return NextResponse.json({ ok: true, feature: updated });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Prisma throws if record not found
    if (msg.includes("Record to update not found")) {
      return NextResponse.json({ error: "Feature key not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
