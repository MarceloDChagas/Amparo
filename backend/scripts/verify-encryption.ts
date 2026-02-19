/* eslint-disable no-console */
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

import { Victim } from "../src/core/domain/entities/victim.entity";
import { PrismaService } from "../src/infra/database/prisma.service";
import { PrismaVictimRepository } from "../src/infra/database/repositories/prisma-victim.repository";
import { EncryptionService } from "../src/infra/services/encryption.service";

async function main() {
  console.log("Starting Encryption Verification...");

  // Mock ConfigService
  const configService = {
    get: (key: string) => {
      if (key === "ENCRYPTION_KEY")
        return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
      return null;
    },
  } as ConfigService;

  const prismaClient = new PrismaClient();
  // Cast to unknown first to avoid type mismatch if PrismaService has extra properties
  const prismaService = prismaClient as unknown as PrismaService;

  const encryptionService = new EncryptionService(configService);
  const victimRepo = new PrismaVictimRepository(
    prismaService,
    encryptionService,
  );

  const testCpf = "123.456.789-00";
  const testName = "Encryption Test Victim";

  try {
    console.log("Creating victim...");
    const victim = new Victim({
      id: "test-id-" + Date.now(),
      name: testName,
      cpf: testCpf,
      createdAt: new Date(),
    } as Victim);

    const created = await victimRepo.create(victim);
    console.log("Victim created with ID:", created.id);

    // Verify Repository returns decrypted data
    if (created.cpf !== testCpf) {
      console.error("❌ Repository did not return decrypted CPF!");
      console.error(`Expected: ${testCpf}, Got: ${created.cpf}`);
    } else {
      console.log("✅ Repository returned decrypted CPF correctly.");
    }

    // Verify Database has encrypted data
    const rawRecord = await prismaClient.victim.findUnique({
      where: { id: created.id },
    });

    if (!rawRecord) {
      console.error("❌ Could not find record in DB!");
      return;
    }

    console.log(`Raw DB CPF: ${rawRecord.cpf}`);
    console.log(`Raw DB Hash: ${rawRecord.cpfHash}`);

    if (rawRecord.cpf === testCpf) {
      console.error("❌ Data is NOT encrypted in database!");
    } else {
      console.log("✅ Data IS encrypted in database.");
    }

    // Clean up
    await victimRepo.delete(created.id);
    console.log("Test victim deleted.");
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

void main();
