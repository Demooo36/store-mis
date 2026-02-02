import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Any logged-in user can fetch stores (needed for Active Store selector)
    requireAuth(req as any);

    const stores = await prisma.store.findMany({
      orderBy: { name: "asc" },
      select: {
        storeId: true,
        name: true,
        address: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ stores });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = requireAuth(req);
    requireRole(actor, ["Admin"]);

    const body = await req.json();
    const { name, address, timezone } = body || {};

    if (!name || !address || !timezone) {
      return NextResponse.json(
        { error: "name, address, timezone are required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: { name, address, timezone },
      select: {
        storeId: true,
        name: true,
        address: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, store }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg.includes("Unique constraint failed")) {
      return NextResponse.json({ error: "Store name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}