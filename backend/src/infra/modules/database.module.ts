import { Global, Module } from "@nestjs/common";

import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";
import { PrismaService } from "@/infra/database/prisma.service";
import { MockUserRepository } from "@/infra/database/repositories/mock-user.repository";
import { PrismaNoteRepository } from "@/infra/database/repositories/prisma-note.repository";
import { PrismaUserRepository } from "@/infra/database/repositories/prisma-user.repository";
import { EncryptionService } from "@/infra/services/encryption.service";

/**
 * DatabaseModule provides global PrismaService, EncryptionService, and
 * UserRepository instances to avoid duplication across the application.
 *
 * Set USE_MOCK_DB=true environment variable to use mock data without database.
 */
@Global()
@Module({
  providers: [
    PrismaService,
    EncryptionService,
    {
      provide: USER_REPOSITORY,
      useClass:
        process.env.USE_MOCK_DB === "true"
          ? MockUserRepository
          : PrismaUserRepository,
    },
    {
      provide: "NoteRepository",
      useClass: PrismaNoteRepository,
    },
  ],
  exports: [
    PrismaService,
    EncryptionService,
    USER_REPOSITORY,
    "NoteRepository",
  ],
})
export class DatabaseModule {}
