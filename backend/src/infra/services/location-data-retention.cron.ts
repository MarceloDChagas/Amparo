import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { PurgeLocationDataUseCase } from "@/core/use-cases/purge-location-data.use-case";

/**
 * RN10 — Tempo de Retenção de Dados de Localização
 *
 * Executa diariamente à meia-noite e delega ao PurgeLocationDataUseCase
 * a remoção de dados de rastreamento em segundo plano (não-emergência)
 * com mais de 60 dias, conforme exigência de LGPD e controle de custo.
 */
@Injectable()
export class LocationDataRetentionCron {
  private readonly logger = new Logger(LocationDataRetentionCron.name);

  constructor(private readonly purgeLocationData: PurgeLocationDataUseCase) {}

  @Cron("0 0 * * *") // diariamente à meia-noite
  async handle(): Promise<void> {
    try {
      const result = await this.purgeLocationData.execute();
      this.logger.log(
        `RN10 — Retenção aplicada: ${result.checkInsDeleted} check-ins e ${result.schedulesDeleted} agendamentos removidos (corte: ${result.cutoffDate.toISOString()})`,
      );
    } catch (err) {
      this.logger.error(
        `RN10 — Erro na purga de dados de localização: ${String(err)}`,
      );
    }
  }
}
