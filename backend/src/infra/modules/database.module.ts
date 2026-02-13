import { Global, Module } from "@nestjs/common";

import { PrismaService } from "@/infra/database/prisma.service";

/**
 * DatabaseModule provides a global PrismaService instance
 * to avoid multiple database connections across the application.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
