/*
  Warnings:

  - You are about to drop the `LoyaltyTier` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('manualPurchase', 'redeem', 'void', 'adjust');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'Active', 'paused', 'ended');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('pending', 'used', 'expired', 'voided');

-- DropTable
DROP TABLE "LoyaltyTier";

-- CreateTable
CREATE TABLE "LoyaltyTiers" (
    "tierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requiredPoints" INTEGER NOT NULL,
    "benefitsJson" JSONB,

    CONSTRAINT "LoyaltyTiers_pkey" PRIMARY KEY ("tierId")
);

-- CreateTable
CREATE TABLE "loyaltyCard" (
    "loyaltyAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyaltyCard_pkey" PRIMARY KEY ("loyaltyAccountId")
);

-- CreateTable
CREATE TABLE "pointsLedger" (
    "pointsLedgerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "loyaltyAccountId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "pointsDelta" INTEGER NOT NULL,
    "details" JSONB,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pointsLedger_pkey" PRIMARY KEY ("pointsLedgerId")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CampaignStatus" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "pointsRequired" INTEGER NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardPayload" JSONB,
    "expiredInDats" INTEGER,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "rewardClaims" (
    "claimId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RewardStatus" NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "usedIn" TEXT NOT NULL,
    "usedInSaleId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "rewardClaims_pkey" PRIMARY KEY ("claimId")
);

-- CreateTable
CREATE TABLE "campaignStampLedger" (
    "stampId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "stampsDelta" INTEGER NOT NULL,
    "claimId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaignStampLedger_pkey" PRIMARY KEY ("stampId")
);

-- CreateTable
CREATE TABLE "products" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "sales" (
    "saleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("saleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyTiers_name_key" ON "LoyaltyTiers"("name");

-- AddForeignKey
ALTER TABLE "loyaltyCard" ADD CONSTRAINT "loyaltyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pointsLedger" ADD CONSTRAINT "pointsLedger_loyaltyAccountId_fkey" FOREIGN KEY ("loyaltyAccountId") REFERENCES "loyaltyCard"("loyaltyAccountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewardClaims" ADD CONSTRAINT "rewardClaims_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewardClaims" ADD CONSTRAINT "rewardClaims_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("campaignId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaignStampLedger" ADD CONSTRAINT "campaignStampLedger_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("campaignId") ON DELETE CASCADE ON UPDATE CASCADE;
