-- AlterTable: adiciona riskScore ao HeatMapCell e atualiza índice de intensity
ALTER TABLE "HeatMapCell" ADD COLUMN "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "HeatMapCell_riskScore_idx" ON "HeatMapCell"("riskScore");
