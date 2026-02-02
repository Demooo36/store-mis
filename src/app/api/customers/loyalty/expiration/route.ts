import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const actor = requireAuth(req);
    requireRole(actor, ["Admin"]);

    const body = await req.json();
    const { userId, expirationDate } = body || {};

    if (!userId || !expirationDate) {
      return NextResponse.json(
        { error: "userId and expirationDate are required" },
        { status: 400 }
      );
    }

    const exp = new Date(expirationDate);
    if (Number.isNaN(exp.getTime())) {
      return NextResponse.json(
        { error: "expirationDate must be a valid date string (ISO recommended)" },
        { status: 400 }
      );
    }

    // Ensure target is a customer
    const customer = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, role: true },
    });

    if (!customer || customer.role !== "Customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Update the customer's loyalty card expiration
    // Your schema doesn't enforce userId unique on loyaltyCard, so we update the newest record.
    const card = await prisma.loyaltyCard.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { loyaltyAccountId: true },
    });

    if (!card) {
      return NextResponse.json({ error: "Customer has no loyalty card" }, { status: 404 });
    }

    const updated = await prisma.loyaltyCard.update({
      where: { loyaltyAccountId: card.loyaltyAccountId },
      data: { expirationDate: exp },
      select: {
        loyaltyAccountId: true,
        userId: true,
        tierId: true,
        expirationDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, loyaltyCard: updated });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
