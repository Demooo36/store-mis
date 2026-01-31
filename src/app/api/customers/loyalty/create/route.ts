import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const actor = requireAuth(req as any);
    requireRole(actor, ["Admin", "Cashier"]);

    const body = await req.json();
    const { userId, tierId, expirationDate } = body || {};

    if (!userId || !tierId || !expirationDate) {
      return NextResponse.json(
        { error: "userId, tierId, expirationDate are required" },
        { status: 400 }
      );
    }

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

    // Prevent duplicate loyalty accounts for same user (since schema doesn't enforce uniqueness yet)
    const existing = await prisma.loyaltyCard.findFirst({
      where: { userId },
      select: { loyaltyAccountId: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Customer already has a loyalty card" }, { status: 409 });
    }

    const card = await prisma.loyaltyCard.create({
      data: {
        userId,
        tierId,
        expirationDate: new Date(expirationDate),
      },
      select: { loyaltyAccountId: true, userId: true, tierId: true, expirationDate: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, card });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
