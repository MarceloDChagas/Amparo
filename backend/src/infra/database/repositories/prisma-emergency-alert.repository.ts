import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaEmergencyAlertRepository implements EmergencyAlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(alert: EmergencyAlert): Promise<void> {
    await this.prisma.emergencyAlert.create({
      data: {
        id: alert.id,
        latitude: alert.latitude,
        longitude: alert.longitude,
        createdAt: alert.createdAt,
        status: alert.status,
        address: alert.address,
        userId: alert.userId,
      },
    });
  }
}
