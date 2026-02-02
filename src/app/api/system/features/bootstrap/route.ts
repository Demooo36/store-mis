import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

const DEFAULT_FEATURES: Array<{ feature_key: string; enabled: boolean }> = [
  { feature_key: "LOYALTY_CORE", enabled: true },
  { feature_key: "POS_ENABLED", enabled: false },
  { feature_key: "SALES_ENABLED", enabled: false },
  { feature_key: "INVENTORY_ENABLED", enabled: false },
  { feature_key: "REPORTS_ENABLED", enabled: false },
];

export async function POST(req: Request) {
  try {
    requireSuperAdmin(req as any);

    // idempotent: create missing rows, do not overwrite existing values
    const existing = await prisma.systemFeature.findMany({
      select: { feature_key: true },
    });
    const existingKeys = new Set(existing.map((r) => r.feature_key));

    const toCreate = DEFAULT_FEATURES.filter((f) => !existingKeys.has(f.feature_key));
    if (toCreate.length === 0) {
      return NextResponse.json({ ok: true, created: 0, message: "No missing features." });
    }

    await prisma.systemFeature.createMany({
      data: toCreate.map((f) => ({
        feature_key: f.feature_key,
        enabled: f.enabled,
        updated_by: null,
      })),
    });

    return NextResponse.json({ ok: true, created: toCreate.length, keys: toCreate.map((x) => x.feature_key) });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
