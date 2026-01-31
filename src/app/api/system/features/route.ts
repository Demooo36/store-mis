import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Decide policy: I recommend "any logged-in user can read feature flags"
    requireAuth(req);

    const rows = await prisma.systemFeature.findMany({
      orderBy: { feature_key: "asc" },
      select: { feature_key: true, enabled: true, updated_at: true, updated_by: true },
    });

    return NextResponse.json({ features: rows });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
