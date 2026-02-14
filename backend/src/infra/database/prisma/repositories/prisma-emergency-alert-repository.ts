import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

import { PrismaService } from "../../prisma.service";

@Injectable()
export class PrismaEmergencyAlertRepository implements EmergencyAlertRepository {
  constructor(private prisma: PrismaService) {}

  async create(alert: EmergencyAlert): Promise<void> {
    await this.prisma.emergencyAlert.create({
      data: {
        id: alert.id,
        latitude: alert.latitude,
        longitude: alert.longitude,
        status: alert.status,
        address: alert.address,
        victimId: alert.victimId,
        createdAt: alert.createdAt,
      },
    });
  }
}
