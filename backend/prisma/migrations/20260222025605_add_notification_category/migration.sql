-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('ALERT', 'SUCCESS', 'WARNING', 'INFO', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "category" "NotificationCategory" NOT NULL DEFAULT 'INFO';

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");
