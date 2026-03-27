import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { CalculateHeatMapUseCase } from "@/core/use-cases/heat-map/calculate-heat-map.use-case";
import { PrismaService } from "@/infra/database/prisma.service";

/**
 * AM-152 — Atualiza o heat map a cada 6h com recalculação completa.
 *
 * Usa PrismaService diretamente para evitar dependência circular com OccurrenceModule.
 */
@Injectable()
export class HeatMapRefreshCron {
  private readonly logger = new Logger(HeatMapRefreshCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly calculateHeatMapUseCase: CalculateHeatMapUseCase,
  ) {}

  @Cron("0 */6 * * *") // A cada 6 horas
  async handle(): Promise<void> {
    this.logger.log("Iniciando recalculação periódica do heat map (6h)...");
    try {
      const rows = await this.prisma.occurrence.findMany({
        select: {
          id: true,
          description: true,
          latitude: true,
          longitude: true,
          userId: true,
          aggressorId: true,
          createdAt: true,
        },
      });

      const occurrences = rows.map(
        (r) =>
          new Occurrence({
            id: r.id,
            description: r.description,
            latitude: r.latitude,
            longitude: r.longitude,
            userId: r.userId,
            aggressorId: r.aggressorId,
            createdAt: r.createdAt,
          }),
      );

      await this.calculateHeatMapUseCase.execute(occurrences);
      this.logger.log("Recalculação do heat map concluída.");
    } catch (err) {
      this.logger.error(`Erro na recalculação do heat map: ${String(err)}`);
    }
  }
}
