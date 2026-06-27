-- AlterTable: Add unique constraint on (positionId, candidateId) to prevent duplicate applications
CREATE UNIQUE INDEX "Application_positionId_candidateId_key" ON "Application"("positionId", "candidateId");
