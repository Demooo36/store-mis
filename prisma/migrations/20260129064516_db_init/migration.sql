-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('sales', 'refund', 'system');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('cashier', 'customer', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('In', 'Out');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Gcash', 'Maya', 'Debit', 'Credit');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('Senior', 'Student');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Admin', 'Cashier', 'Customer');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Pending', 'Active', 'Rejected', 'Disabled');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('manualPurchase', 'redeem', 'void', 'adjust');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'Active', 'paused', 'ended');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('pending', 'used', 'expired', 'voided');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('inStore', 'online');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserQR" (
    "qrId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserQR_pkey" PRIMARY KEY ("qrId")
);

-- CreateTable
CREATE TABLE "Store" (
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("storeId")
);

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
    "cashierId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "saleType" "SaleType" NOT NULL,
    "currency" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "discountTotal" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "SaleItems" (
    "saleItemId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT,
    "name_snapshot" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItems_pkey" PRIMARY KEY ("saleItemId")
);

-- CreateTable
CREATE TABLE "SaleDiscount" (
    "saleDiscountId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "claimId" TEXT,
    "notes" TEXT NOT NULL,

    CONSTRAINT "SaleDiscount_pkey" PRIMARY KEY ("saleDiscountId")
);

-- CreateTable
CREATE TABLE "PaymentRecords" (
    "paymentId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PaymentRecords_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "lowStockTreshold" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "ProductStock" (
    "storeId" TEXT NOT NULL,
    "ProductId" TEXT NOT NULL,
    "onHand" INTEGER NOT NULL,

    CONSTRAINT "ProductStock_pkey" PRIMARY KEY ("storeId")
);

-- CreateTable
CREATE TABLE "ProductMove" (
    "moveId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "moveType" "MoveType" NOT NULL,
    "qtyDelta" INTEGER NOT NULL,
    "saleId" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductMove_pkey" PRIMARY KEY ("moveId")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "activityId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "RefundReasons" (
    "refundReasonId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefundReasons_pkey" PRIMARY KEY ("refundReasonId")
);

-- CreateTable
CREATE TABLE "superAdmins" (
    "superAdminId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "superAdmins_pkey" PRIMARY KEY ("superAdminId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserQR_userId_key" ON "UserQR"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyTiers_name_key" ON "LoyaltyTiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "superAdmins_email_key" ON "superAdmins"("email");

-- AddForeignKey
ALTER TABLE "UserQR" ADD CONSTRAINT "UserQR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItems" ADD CONSTRAINT "SaleItems_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("saleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
