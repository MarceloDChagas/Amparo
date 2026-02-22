import { Injectable } from "@nestjs/common";

import { AlertEvent } from "@/core/domain/entities/alert-event";
import { AlertEventRepository } from "@/core/repositories/alert-event-repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaAlertEventRepository implements AlertEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(event: AlertEvent): Promise<AlertEvent> {
    const data = await this.prisma.alertEvent.create({
      data: {
        id: event.id,
        alertId: event.alertId,
        type: event.type,
        source: event.source,
        message: event.message,
        metadata: event.metadata,
        createdAt: event.createdAt,
      },
    });

    return new AlertEvent(
      data.id,
      data.alertId,
      data.type,
      data.source,
      data.message,
      data.metadata,
      data.createdAt,
    );
  }

  async findByAlertId(alertId: string): Promise<AlertEvent[]> {
    const events = await this.prisma.alertEvent.findMany({
      where: { alertId },
      orderBy: { createdAt: "asc" },
    });

    return events.map(
      (data) =>
        new AlertEvent(
          data.id,
          data.alertId,
          data.type,
          data.source,
          data.message,
          data.metadata,
          data.createdAt,
        ),
    );
  }
}
