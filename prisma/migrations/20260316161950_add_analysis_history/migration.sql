/*
  Warnings:

  - You are about to drop the column `result` on the `AnalysisHistory` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `AnalysisHistory` table. All the data in the column will be lost.
  - Added the required column `analysis` to the `AnalysisHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `AnalysisHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `AnalysisHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnalysisHistory" DROP CONSTRAINT "AnalysisHistory_resumeId_fkey";

-- AlterTable
ALTER TABLE "AnalysisHistory" DROP COLUMN "result",
DROP COLUMN "resumeId",
ADD COLUMN     "analysis" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL;
