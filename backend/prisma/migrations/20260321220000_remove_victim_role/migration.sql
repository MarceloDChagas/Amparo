-- Migration: remove VICTIM from Role enum
-- PostgreSQL does not support DROP VALUE on enums, so we recreate the type.

-- 1. Convert any existing VICTIM users to USER
UPDATE "User" SET role = 'USER' WHERE role = 'VICTIM';

-- 2. Drop the default (which depends on the enum type) and change column to text
ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN role TYPE TEXT;

-- 3. Drop old enum and recreate without VICTIM
DROP TYPE "Role";
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- 4. Restore the column type and default using the new enum
ALTER TABLE "User" ALTER COLUMN role TYPE "Role" USING role::"Role";
ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'USER'::"Role";
