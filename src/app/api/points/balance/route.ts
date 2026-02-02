import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const actor = requireAuth(req);

    // Keep your URL param as user_id if you want, but map it to userId for Prisma
    const user_id = req.nextUrl.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // Roles in your system are: Admin / Cashier / Customer
    if (actor.role === "Customer" && actor.userId !== user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (actor.role !== "Customer") {
      requireRole(actor, ["Admin", "Cashier"]);
    }

    const agg = await prisma.pointsLedger.aggregate({
      where: { userId: user_id },
      _sum: { pointsDelta: true },
    });

    const balance = agg._sum.pointsDelta ?? 0;

    return NextResponse.json({ user_id, balance });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
