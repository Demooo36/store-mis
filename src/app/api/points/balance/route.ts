import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const actor = requireAuth(req);

    const user_id = req.nextUrl.searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    // Customers can only view their own balance; cashier/admin can view anyone
    if (actor.role === "customer" && actor.userId !== user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Optional strictness: allow cashier/admin only (remove if not wanted)
    if (actor.role !== "customer") requireRole(actor, ["admin", "cashier"]);

    const agg = await prisma.pointsLedger.aggregate({
      where: { user_id },
      _sum: { points_delta: true },
    });

    const balance = agg._sum.points_delta ?? 0;

    return NextResponse.json({ user_id, balance });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
