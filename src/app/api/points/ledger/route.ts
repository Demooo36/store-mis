import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const actor = requireAuth(req);

    const qpUserId = req.nextUrl.searchParams.get("userId");
    const limitRaw = req.nextUrl.searchParams.get("limit");

    const limit = Math.min(Math.max(Number(limitRaw ?? 30) || 30, 1), 200);

    // customers can only see their own
    const userId = actor.role === "Customer" ? actor.userId : qpUserId;

    if (!userId) {
      return NextResponse.json({ error: "userId is required for admin/cashier" }, { status: 400 });
    }

    const rows = await prisma.pointsLedger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        pointsLedgerId: true,
        userId: true,
        storeId: true,
        pointsDelta: true,
        sourceType: true,
        sourceId: true,
        details: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ userId, items: rows });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
