-- CreateTable
CREATE TABLE "AnalysisHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "AnalysisHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalysisHistory" ADD CONSTRAINT "AnalysisHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisHistory" ADD CONSTRAINT "AnalysisHistory_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
