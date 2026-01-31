import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";
import crypto from "crypto";

function newToken() {
  return crypto.randomBytes(24).toString("hex"); // 48 chars
}

export async function POST(req: Request) {
  try {
    const actor = requireAuth(req as any);
    requireRole(actor, ["Customer"]);

    const token = newToken();

    // UserQR.userId is @unique => upsert is the correct "rotate"
    const qr = await prisma.userQR.upsert({
      where: { userId: actor.userId },
      update: { token, isActive: true },
      create: { userId: actor.userId, token, isActive: true },
      select: { qrId: true, userId: true, token: true, isActive: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ ok: true, qr });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
