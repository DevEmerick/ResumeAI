-- AlterTable
ALTER TABLE "AnalysisHistory" ADD COLUMN     "error" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "analysis" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastTokenRefill" TIMESTAMP(3),
ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 3;
