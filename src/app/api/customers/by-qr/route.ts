import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["admin", "cashier"]);

    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    const qr = await prisma.userQrToken.findFirst({
      where: { token, active: true },
      select: { user_id: true },
    });

    if (!qr) return NextResponse.json({ error: "QR token not found/expired" }, { status: 404 });

    const customer = await prisma.user.findUnique({
      where: { user_id: qr.user_id },
      select: { user_id: true, full_name: true, role: true, status: true },
    });

    if (!customer || customer.role !== "customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const loyalty = await prisma.loyaltyCard.findUnique({
      where: { user_id: customer.user_id },
      select: { loyalty_account_id: true, tier_id: true, expiration_date: true, created_at: true },
    });

    return NextResponse.json({ customer, loyalty });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
