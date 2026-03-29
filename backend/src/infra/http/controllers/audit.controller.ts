import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Role } from "@/core/domain/enums/role.enum";
import { PrismaService } from "@/infra/database/prisma.service";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

@Controller("audit-logs")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("recent")
  @Roles(Role.ADMIN)
  async getRecent(@Query("limit") limit?: string) {
    const take = Math.min(Math.max(parseInt(limit ?? "5", 10) || 5, 1), 50);
    return this.prisma.auditLog.findMany({
      where: { action: { not: "GET" } },
      take,
      orderBy: { createdAt: "desc" },
    });
  }
}
