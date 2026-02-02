import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const actor = requireAuth(req as any);
    requireRole(actor, ["Customer"]);

    const body = await req.json();
    const { campaignId } = body || {};
    if (!campaignId) return NextResponse.json({ error: "campaignId is required" }, { status: 400 });

    const now = new Date();

    const campaign = await prisma.campaigns.findUnique({
      where: { campaignId },
      select: {
        campaignId: true,
        status: true,
        startAt: true,
        endAt: true,
        pointsRequired: true,
        expiredInDats: true,
      },
    });
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

    if (campaign.status !== "Active" || now < campaign.startAt || now > campaign.endAt) {
      return NextResponse.json({ error: "Campaign not redeemable" }, { status: 409 });
    }

    // compute points balance (ledger source of truth)
    const agg = await prisma.pointsLedger.aggregate({
      where: { userId: actor.userId },
      _sum: { pointsDelta: true },
    });
    const balance = agg._sum.pointsDelta ?? 0;

    if (balance < campaign.pointsRequired) {
      return NextResponse.json({ error: "Insufficient points", balance }, { status: 409 });
    }

    // expiry date for claim
    const expiresAt =
      campaign.expiredInDats && campaign.expiredInDats > 0
        ? new Date(now.getTime() + campaign.expiredInDats * 24 * 60 * 60 * 1000)
        : new Date(campaign.endAt);

    // Create claim + deduct points in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.rewardClaims.create({
        data: {
          campaignId: campaign.campaignId,
          userId: actor.userId,
          status: "pending",
          issuedAt: now,
          expiresAt,
          usedAt: now, // (your schema requires usedAt; you might want to make this nullable later)
          usedIn: "loyalty",
          usedInSaleId: "",
          metadata: { redeemedAt: now.toISOString() },
        },
        select: { claimId: true, status: true, issuedAt: true, expiresAt: true },
      });

      await tx.pointsLedger.create({
        data: {
          userId: actor.userId,
          storeId: "N/A", // you may want a real storeId here if redemption happens in a store
          loyaltyAccountId: "", // schema requires it; consider making redeem tie to loyalty card or make nullable later
          sourceType: "redeem",
          sourceId: claim.claimId,
          pointsDelta: -campaign.pointsRequired,
          details: { campaignId: campaign.campaignId },
          createdBy: actor.userId,
        },
      });

      return claim;
    });

    return NextResponse.json({ ok: true, claim: result });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
