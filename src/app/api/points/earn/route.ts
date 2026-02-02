import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

function calcPoints(amountPhp: number) {
  // ₱50 = 1 point, floor
  return Math.floor(amountPhp / 50);
}

export async function POST(req: NextRequest) {
  try {
    const actor = requireAuth(req);
    requireRole(actor, ["Admin", "Cashier"]);

    const body = await req.json();
    const { token, storeId, amountPhp } = body || {};

    if (!token || !storeId || amountPhp == null) {
      return NextResponse.json(
        { error: "token, storeId, amountPhp are required" },
        { status: 400 }
      );
    }

    const amount = Number(amountPhp);
    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: "amountPhp must be a non-negative number" },
        { status: 400 }
      );
    }

    //  Validate store exists
    const store = await prisma.store.findUnique({
      where: { storeId },
      select: { storeId: true, name: true },
    });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    //  Resolve customer via active QR token
    const qr = await prisma.userQR.findFirst({
      where: { token, isActive: true },
      select: { userId: true },
    });
    if (!qr) {
      return NextResponse.json({ error: "QR token not found/expired" }, { status: 404 });
    }

    const customer = await prisma.user.findUnique({
      where: { userId: qr.userId },
      select: { userId: true, role: true, status: true },
    });
    if (!customer || customer.role !== "Customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    if (customer.status !== "Active") {
      return NextResponse.json({ error: "Customer account not active" }, { status: 403 });
    }

    //  Get loyalty account (NOT findUnique, since userId isn't unique in loyaltyCard yet)
    const loyalty = await prisma.loyaltyCard.findFirst({
      where: { userId: customer.userId },
      select: { loyaltyAccountId: true },
    });
    if (!loyalty) {
      return NextResponse.json({ error: "Customer has no loyalty card" }, { status: 409 });
    }

    //  Calculate points
    const points = calcPoints(amount);

    if (points <= 0) {
      return NextResponse.json({
        ok: true,
        pointsEarned: 0,
        message: "Amount below ₱50; no points earned.",
      });
    }

    // Write ledger entry
    const entry = await prisma.pointsLedger.create({
      data: {
        userId: customer.userId,
        storeId: store.storeId,
        loyaltyAccountId: loyalty.loyaltyAccountId,
        sourceType: "manualPurchase",
        sourceId: null,
        pointsDelta: points,
        details: { amountPhp: amount, rate: "50php=1pt", rounding: "floor" },
        createdBy: actor.userId,
      },
      select: {
        pointsLedgerId: true,
        pointsDelta: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, pointsEarned: points, ledgerEntry: entry });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
