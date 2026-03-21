-- Add DB-level defaults to @updatedAt columns so the pg driver adapter
-- doesn't fail with NullConstraintViolation on INSERT operations.
-- Prisma still manages the value via @updatedAt; this default is a safety net.

ALTER TABLE "Occurrence"        ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EmergencyContact"  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User"              ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "CheckIn"           ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Note"              ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "HeatMapCell"       ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PatrolRoute"       ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "SafeLocation"      ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Document"          ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
