-- AlterTable: Add default value to updatedAt column
ALTER TABLE "EmergencyContact" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
