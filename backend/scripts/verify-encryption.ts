/* eslint-disable no-console */
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

import { User } from "../src/core/domain/entities/user.entity";
import { PrismaService } from "../src/infra/database/prisma.service";
import { PrismaUserRepository } from "../src/infra/database/repositories/prisma-user.repository";
import { EncryptionService } from "../src/infra/services/encryption.service";

async function main() {
  console.log("Starting Encryption Verification...");

  // Mock ConfigService — only the `get` method is needed by EncryptionService
  const configService = {
    get: (key: string): string | null => {
      if (key === "ENCRYPTION_KEY")
        return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
      return null;
    },
  };

  const prismaClient = new PrismaClient();
  // Cast to unknown first to avoid type mismatch if PrismaService has extra properties
  const prismaService = prismaClient as unknown as PrismaService;

  const encryptionService = new EncryptionService(
    configService as unknown as ConfigService,
  );
  const userRepo = new PrismaUserRepository(prismaService, encryptionService);

  const testCpf = "123.456.789-00";
  const testName = "Encryption Test User";

  try {
    console.log("Creating user...");
    const user = new User({
      id: "test-id-" + Date.now(),
      name: testName,
      email: "test-" + Date.now() + "@example.com",
      password: "password123",
      cpf: testCpf,
      createdAt: new Date(),
    } as User);

    const created = await userRepo.create(user);
    console.log("User created with ID:", created.id);

    // Verify Repository returns decrypted data
    if (created.cpf !== testCpf) {
      console.error("❌ Repository did not return decrypted CPF!");
      console.error(`Expected: ${testCpf}, Got: ${created.cpf}`);
    } else {
      console.log("✅ Repository returned decrypted CPF correctly.");
    }

    // Verify Database has encrypted data
    const rawRecord = await prismaClient.user.findUnique({
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
    await userRepo.delete(created.id);
    console.log("Test user deleted.");
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

void main();
