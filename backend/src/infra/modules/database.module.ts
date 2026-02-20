import { Global, Module } from "@nestjs/common";

import { PrismaService } from "@/infra/database/prisma.service";
import { PrismaUserRepository } from "@/infra/database/repositories/prisma-user.repository";
import { EncryptionService } from "@/infra/services/encryption.service";

/**
 * DatabaseModule provides global PrismaService, EncryptionService, and
 * UserRepository instances to avoid duplication across the application.
 */
@Global()
@Module({
  providers: [
    PrismaService,
    EncryptionService,
    {
      provide: "UserRepository",
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, EncryptionService, "UserRepository"],
})
export class DatabaseModule {}
