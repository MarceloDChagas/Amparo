import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
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
      where: {
        status: { in: [AlertStatus.PENDING, AlertStatus.DISPATCHED] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!alert) return null;

    return this.toDomain(alert);
  }

  async findById(id: string): Promise<EmergencyAlert | null> {
    const alert = await this.prisma.emergencyAlert.findUnique({
      where: { id },
    });

    if (!alert) return null;

    return this.toDomain(alert);
  }

  async findAll(): Promise<EmergencyAlert[]> {
    const alerts = await this.prisma.emergencyAlert.findMany({
      orderBy: { createdAt: "desc" },
    });

    return alerts.map((a) => this.toDomain(a));
  }

  async updateStatus(
    id: string,
    status: string,
    cancellationReason?: string | null,
  ): Promise<void> {
    await this.prisma.emergencyAlert.update({
      where: { id },
      data: {
        status,
        ...(cancellationReason !== undefined && { cancellationReason }),
      },
    });
  }

  private toDomain(alert: {
    id: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    status: string;
    address: string | null;
    userId: string | null;
    cancellationReason?: string | null;
  }): EmergencyAlert {
    return new EmergencyAlert(
      alert.id,
      alert.latitude,
      alert.longitude,
      alert.createdAt,
      alert.status as AlertStatus,
      alert.address,
      alert.userId,
      alert.cancellationReason ?? null,
    );
  }
}
