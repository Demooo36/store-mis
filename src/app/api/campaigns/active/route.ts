import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);

    const now = new Date();

    const items = await prisma.campaigns.findMany({
      where: {
        status: "Active",
        startAt: { lte: now },
        endAt: { gte: now },
      },
      orderBy: { startAt: "desc" },
      select: {
        campaignId: true,
        name: true,
        description: true,
        pointsRequired: true,
        rewardType: true,
        rewardPayload: true,
        startAt: true,
        endAt: true,
      },
    });

    return NextResponse.json({ campaigns: items });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
