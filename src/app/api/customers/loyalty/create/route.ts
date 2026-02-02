import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

function oneYearFromNow() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

export async function POST(req: NextRequest) {
  try {
    const actor = requireAuth(req);
    requireRole(actor, ["Admin", "Cashier"]);

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const customer = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, role: true, status: true },
    });
    if (!customer || customer.role !== "Customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    if (customer.status !== "Active") {
      return NextResponse.json({ error: "Customer account not active" }, { status: 403 });
    }

    const existing = await prisma.loyaltyCard.findFirst({
      where: { userId },
      select: { loyaltyAccountId: true },
    });
    if (existing) return NextResponse.json({ error: "Customer already has a loyalty card" }, { status: 409 });

    // Lowest tier = smallest requiredPoints
    const lowestTier = await prisma.loyaltyTiers.findFirst({
      orderBy: { requiredPoints: "asc" },
      select: { tierId: true },
    });
    if (!lowestTier) {
      return NextResponse.json({ error: "No tiers configured" }, { status: 409 });
    }

    const card = await prisma.loyaltyCard.create({
      data: {
        userId,
        tierId: lowestTier.tierId,
        expirationDate: oneYearFromNow(),
      },
      select: { loyaltyAccountId: true, userId: true, tierId: true, expirationDate: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, card }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
