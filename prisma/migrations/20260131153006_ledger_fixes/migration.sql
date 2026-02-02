-- AlterTable
ALTER TABLE "pointsLedger" ALTER COLUMN "storeId" SET DATA TYPE TEXT,
ALTER COLUMN "sourceId" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP DEFAULT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "system_features" (
    "feature_key" VARCHAR(64) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,

    CONSTRAINT "system_features_pkey" PRIMARY KEY ("feature_key")
);

-- AddForeignKey
ALTER TABLE "system_features" ADD CONSTRAINT "system_features_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
