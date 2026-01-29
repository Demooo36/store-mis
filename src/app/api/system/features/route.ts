import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.systemFeature.findMany({
    orderBy: { feature_key: "asc" },
    select: { feature_key: true, enabled: true, updated_at: true, updated_by: true },
  });

  return NextResponse.json({ features: rows });
}
