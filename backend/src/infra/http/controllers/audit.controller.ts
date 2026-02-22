import { Controller, Get, UseGuards } from "@nestjs/common";
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
  async getRecent() {
    return this.prisma.auditLog.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  }
}
