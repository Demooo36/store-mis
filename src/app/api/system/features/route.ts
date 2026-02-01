import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireSuperAdmin(req);

    const rows = await prisma.systemFeature.findMany({
      orderBy: { feature_key: "asc" },
      select: { feature_key: true, enabled: true, updated_at: true, updated_by: true },
    });

    return NextResponse.json({ features: rows });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
