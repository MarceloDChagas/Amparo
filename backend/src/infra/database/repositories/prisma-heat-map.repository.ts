import { Injectable, Logger } from "@nestjs/common";

import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";
import type { IHeatMapRepository } from "@/core/domain/repositories/heat-map-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaHeatMapRepository implements IHeatMapRepository {
  private readonly logger = new Logger(PrismaHeatMapRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<HeatMapCell[]> {
    const cells = await this.prisma.heatMapCell.findMany({
      orderBy: { riskScore: "desc" },
    });
    return cells.map(
      (c) =>
        new HeatMapCell({
          id: c.id,
          cellKey: c.cellKey,
          latitude: c.latitude,
          longitude: c.longitude,
          intensity: c.intensity,
          riskScore: c.riskScore,
          lastOccurrence: c.lastOccurrence,
        }),
    );
  }

  async replaceAll(cells: HeatMapCell[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.heatMapCell.deleteMany();
      if (cells.length > 0) {
        await tx.heatMapCell.createMany({
          data: cells.map((c) => ({
            cellKey: c.cellKey,
            latitude: c.latitude,
            longitude: c.longitude,
            intensity: c.intensity,
            riskScore: c.riskScore,
            lastOccurrence: c.lastOccurrence,
          })),
        });
      }
    });
  }

  async upsertFromOccurrence(occurrence: {
    latitude: number;
    longitude: number;
    aggressorId?: string | null;
    createdAt?: Date;
  }): Promise<void> {
    const cellLat = Math.floor(occurrence.latitude * 100) / 100;
    const cellLng = Math.floor(occurrence.longitude * 100) / 100;
    const cellKey = `${cellLat.toFixed(2)}_${cellLng.toFixed(2)}`;
    const weight = occurrence.aggressorId ? 1.5 : 1.0;
    const now = occurrence.createdAt ?? new Date();

    try {
      await this.prisma.heatMapCell.upsert({
        where: { cellKey },
        update: {
          intensity: { increment: 1 },
          riskScore: { increment: weight },
          lastOccurrence: now,
        },
        create: {
          cellKey,
          latitude: cellLat + 0.005,
          longitude: cellLng + 0.005,
          intensity: 1,
          riskScore: weight,
          lastOccurrence: now,
        },
      });
    } catch (err) {
      this.logger.error(`Erro ao fazer upsert de célula ${cellKey}: ${String(err)}`);
    }
  }
}
