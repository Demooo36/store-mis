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
    requireRole(actor, ["admin", "cashier"]);

    const body = await req.json();
    const { token, store_id, amount_php } = body || {};

    if (!token || !store_id || amount_php == null) {
      return NextResponse.json(
        { error: "token, store_id, amount_php are required" },
        { status: 400 }
      );
    }

    const amount = Number(amount_php);
    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json({ error: "amount_php must be a non-negative number" }, { status: 400 });
    }

    // Validate store exists
    const store = await prisma.store.findUnique({
      where: { store_id },
      select: { store_id: true, name: true },
    });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    // Resolve customer by active QR token
    const qr = await prisma.userQrToken.findFirst({
      where: { token, active: true },
      select: { user_id: true },
    });
    if (!qr) return NextResponse.json({ error: "QR token not found/expired" }, { status: 404 });

    const customer = await prisma.user.findUnique({
      where: { user_id: qr.user_id },
      select: { user_id: true, role: true, status: true },
    });
    if (!customer || customer.role !== "customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    if (customer.status !== "active") {
      return NextResponse.json({ error: "Customer account not active" }, { status: 403 });
    }

    // Loyalty account (optional but recommended)
    const loyalty = await prisma.loyaltyCard.findUnique({
      where: { user_id: customer.user_id },
      select: { loyalty_account_id: true },
    });
    if (!loyalty) return NextResponse.json({ error: "Customer has no loyalty card" }, { status: 409 });

    const points = calcPoints(amount);

    // You said: 98 pesos => 1 point; 0..49 => 0 points (I will allow 0 and just not write ledger)
    if (points <= 0) {
      return NextResponse.json({
        ok: true,
        points_earned: 0,
        message: "Amount below ₱50; no points earned.",
      });
    }

    const entry = await prisma.pointsLedger.create({
      data: {
        user_id: customer.user_id,
        store_id: store.store_id,
        loyalty_account_id: loyalty.loyalty_account_id,
        source_type: "manual_purchase",
        source_id: null,
        points_delta: points,
        details: { amount_php: amount, rate: "50php=1pt", rounding: "floor" },
        created_by: actor.userId,
      },
      select: { points_ledger_id: true, points_delta: true, created_at: true },
    });

    return NextResponse.json({ ok: true, points_earned: points, ledger_entry: entry });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
