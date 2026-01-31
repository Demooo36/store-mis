import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["Admin", "Cashier"]);

    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    const qr = await prisma.userQR.findFirst({
      where: { token, isActive: true },
      select: { userId: true },
    });

    if (!qr) return NextResponse.json({ error: "QR token not found/expired" }, { status: 404 });

    const customer = await prisma.user.findUnique({
      where: { userId: qr.userId },
      select: { userId: true, username: true, role: true, status: true },
    });

    if (!customer || customer.role !== "Customer") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const loyalty = await prisma.loyaltyCard.findFirst({
      where: { userId: customer.userId },
      select: { loyaltyAccountId: true, tierId: true, expirationDate: true, createdAt: true },
    });

    return NextResponse.json({ customer, loyalty });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
