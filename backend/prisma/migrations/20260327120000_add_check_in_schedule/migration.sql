-- CreateTable: CheckInSchedule (AM-154 — Checkin Inteligente e Alerta Automático)
CREATE TABLE "CheckInSchedule" (
    "id"                 TEXT NOT NULL,
    "userId"             TEXT NOT NULL,
    "name"               TEXT NOT NULL,
    "destinationAddress" TEXT,
    "destinationLat"     DOUBLE PRECISION NOT NULL,
    "destinationLng"     DOUBLE PRECISION NOT NULL,
    "expectedArrivalAt"  TIMESTAMP(3) NOT NULL,
    "windowMinutes"      INTEGER NOT NULL DEFAULT 15,
    "status"             TEXT NOT NULL DEFAULT 'PENDING',
    "alertedAt"          TIMESTAMP(3),
    "arrivedAt"          TIMESTAMP(3),
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckInSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckInSchedule" ADD CONSTRAINT "CheckInSchedule_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "CheckInSchedule_userId_idx" ON "CheckInSchedule"("userId");
CREATE INDEX "CheckInSchedule_status_expectedArrivalAt_idx" ON "CheckInSchedule"("status", "expectedArrivalAt");
