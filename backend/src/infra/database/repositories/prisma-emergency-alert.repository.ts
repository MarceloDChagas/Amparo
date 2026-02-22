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

  async findActive(): Promise<EmergencyAlert | null> {
    const alert = await this.prisma.emergencyAlert.findFirst({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (!alert) return null;

    return new EmergencyAlert(
      alert.id,
      alert.latitude,
      alert.longitude,
      alert.createdAt,
      alert.status,
      alert.address,
      alert.userId,
    );
  }

  async findById(id: string): Promise<EmergencyAlert | null> {
    const alert = await this.prisma.emergencyAlert.findUnique({
      where: { id },
    });

    if (!alert) return null;

    return new EmergencyAlert(
      alert.id,
      alert.latitude,
      alert.longitude,
      alert.createdAt,
      alert.status,
      alert.address,
      alert.userId,
    );
  }
}
