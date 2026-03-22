-- RN03 — Campos de escalonamento progressivo de atraso em check-ins
-- +5min: notificação in-app → +15min: email P1 → +30min: email P2/P3 → +45min: alerta crítico no dashboard

ALTER TABLE "CheckIn" ADD COLUMN "overdueAt" TIMESTAMP(3);
ALTER TABLE "CheckIn" ADD COLUMN "escalationStage" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "CheckIn_status_escalationStage_overdueAt_idx" ON "CheckIn"("status", "escalationStage", "overdueAt");
