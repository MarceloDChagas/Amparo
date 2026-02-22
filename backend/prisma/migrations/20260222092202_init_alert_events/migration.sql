-- CreateEnum
CREATE TYPE "AlertEventType" AS ENUM ('LOCATION_UPDATE', 'NOTIFICATION_SENT', 'STATUS_CHANGE', 'COMMENT', 'CREATED');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('SYSTEM', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "type" "AlertEventType" NOT NULL,
    "source" "EventSource" NOT NULL DEFAULT 'SYSTEM',
    "message" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlertEvent_alertId_idx" ON "AlertEvent"("alertId");

-- CreateIndex
CREATE INDEX "AlertEvent_type_idx" ON "AlertEvent"("type");

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "EmergencyAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
