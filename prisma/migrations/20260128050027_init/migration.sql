-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Admin', 'Cashier', 'Customer');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Pending', 'Active', 'Rejected', 'Disabled');

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
CREATE TABLE "LoyaltyTier" (
    "tierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requiredPoints" INTEGER NOT NULL,
    "benefitsJson" JSONB,

    CONSTRAINT "LoyaltyTier_pkey" PRIMARY KEY ("tierId")
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
CREATE UNIQUE INDEX "LoyaltyTier_name_key" ON "LoyaltyTier"("name");

-- AddForeignKey
ALTER TABLE "UserQR" ADD CONSTRAINT "UserQR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
