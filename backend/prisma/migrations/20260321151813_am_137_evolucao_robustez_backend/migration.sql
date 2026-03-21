/*
  Warnings:

  - Added the required column `updatedAt` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PatrolRouteStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_aggressorId_fkey";

-- DropIndex
DROP INDEX "AlertEvent_alertId_idx";

-- DropIndex
DROP INDEX "CheckIn_status_idx";

-- DropIndex
DROP INDEX "CheckIn_userId_idx";

-- DropIndex
DROP INDEX "Document_userId_idx";

-- DropIndex
DROP INDEX "Note_userId_idx";

-- DropIndex
DROP INDEX "Notification_targetId_idx";

-- DropIndex
DROP INDEX "NotificationLog_alertId_idx";

-- AlterTable
ALTER TABLE "Occurrence" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "aggressorId" DROP NOT NULL;

-- Backfill updatedAt for existing Occurrence rows before enforcing NOT NULL
UPDATE "Occurrence" SET "updatedAt" = "createdAt";

-- Enforce NOT NULL on updatedAt after backfill
ALTER TABLE "Occurrence" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "HeatMapCell" (
    "id" TEXT NOT NULL,
    "cellKey" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 1,
    "lastOccurrence" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeatMapCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatrolRoute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "waypoints" TEXT NOT NULL,
    "status" "PatrolRouteStatus" NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "generatedBy" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatrolRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafeLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL DEFAULT 200,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapCell_cellKey_key" ON "HeatMapCell"("cellKey");

-- CreateIndex
CREATE INDEX "HeatMapCell_intensity_idx" ON "HeatMapCell"("intensity");

-- CreateIndex
CREATE INDEX "HeatMapCell_lastOccurrence_idx" ON "HeatMapCell"("lastOccurrence");

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapCell_latitude_longitude_key" ON "HeatMapCell"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "PatrolRoute_status_idx" ON "PatrolRoute"("status");

-- CreateIndex
CREATE INDEX "PatrolRoute_scheduledAt_idx" ON "PatrolRoute"("scheduledAt");

-- CreateIndex
CREATE INDEX "SafeLocation_userId_idx" ON "SafeLocation"("userId");

-- CreateIndex
CREATE INDEX "AlertEvent_alertId_createdAt_idx" ON "AlertEvent"("alertId", "createdAt");

-- CreateIndex
CREATE INDEX "CheckIn_userId_status_idx" ON "CheckIn"("userId", "status");

-- CreateIndex
CREATE INDEX "CheckIn_status_expectedArrivalTime_idx" ON "CheckIn"("status", "expectedArrivalTime");

-- CreateIndex
CREATE INDEX "CheckIn_userId_createdAt_idx" ON "CheckIn"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Document_userId_createdAt_idx" ON "Document"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "EmergencyAlert_status_createdAt_idx" ON "EmergencyAlert"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Note_userId_createdAt_idx" ON "Note"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_targetId_createdAt_idx" ON "Notification"("targetId", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_alertId_createdAt_idx" ON "NotificationLog"("alertId", "createdAt");

-- CreateIndex
CREATE INDEX "Occurrence_userId_idx" ON "Occurrence"("userId");

-- CreateIndex
CREATE INDEX "Occurrence_createdAt_idx" ON "Occurrence"("createdAt");

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_aggressorId_fkey" FOREIGN KEY ("aggressorId") REFERENCES "Aggressor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafeLocation" ADD CONSTRAINT "SafeLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
