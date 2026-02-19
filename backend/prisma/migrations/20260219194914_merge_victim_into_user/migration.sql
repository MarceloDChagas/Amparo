/*
  Warnings:

  - You are about to drop the column `victimId` on the `EmergencyAlert` table. All the data in the column will be lost.
  - You are about to drop the column `victimId` on the `EmergencyContact` table. All the data in the column will be lost.
  - You are about to drop the column `victimId` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the `Victim` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpfHash]` on the table `Aggressor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpfHash` to the `Aggressor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'VICTIM');

-- DropForeignKey
ALTER TABLE "EmergencyAlert" DROP CONSTRAINT "EmergencyAlert_victimId_fkey";

-- DropForeignKey
ALTER TABLE "EmergencyContact" DROP CONSTRAINT "EmergencyContact_victimId_fkey";

-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_victimId_fkey";

-- DropIndex
DROP INDEX "Aggressor_cpf_key";

-- DropIndex
DROP INDEX "EmergencyAlert_victimId_idx";

-- DropIndex
DROP INDEX "EmergencyContact_victimId_idx";

-- AlterTable
ALTER TABLE "Aggressor" ADD COLUMN     "cpfHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmergencyAlert" DROP COLUMN "victimId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "EmergencyContact" DROP COLUMN "victimId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "victimId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Victim";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "cpf" TEXT,
    "cpfHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpfHash_key" ON "User"("cpfHash");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE UNIQUE INDEX "Aggressor_cpfHash_key" ON "Aggressor"("cpfHash");

-- CreateIndex
CREATE INDEX "EmergencyAlert_userId_idx" ON "EmergencyAlert"("userId");

-- CreateIndex
CREATE INDEX "EmergencyContact_userId_idx" ON "EmergencyContact"("userId");

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAlert" ADD CONSTRAINT "EmergencyAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
