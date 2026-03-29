import { Inject, Injectable, Logger } from "@nestjs/common";

import { CheckInRepository } from "@/core/domain/repositories/check-in-repository";
import type { ICheckInScheduleRepository } from "@/core/domain/repositories/check-in-schedule-repository.interface";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

const RETENTION_DAYS = 60;

export interface PurgeLocationDataResult {
  checkInsDeleted: number;
  schedulesDeleted: number;
  cutoffDate: Date;
}

/**
 * RN10 — Tempo de Retenção de Dados de Localização
 *
 * Por LGPD e custo de infraestrutura, dados de geolocalização de rastreamento
 * em segundo plano (não-emergência) são expirados após 60 dias.
 *
 * Dados preservados (nunca deletados):
 * - Occurrence — histórico de incidentes consolidados
 * - EmergencyAlert — alertas de emergência
 * - SafeLocation — áreas seguras cadastradas pela usuária (configuração)
 * - HeatMapCell — dados agregados de análise de risco
 *
 * Dados removidos após 60 dias (rastreamento em segundo plano):
 * - CheckIn finalizados (ON_TIME, LATE, CANCELLED)
 * - CheckInSchedule finalizados (ARRIVED, ALERTED, CANCELLED)
 */
@Injectable()
export class PurgeLocationDataUseCase {
  private readonly logger = new Logger(PurgeLocationDataUseCase.name);

  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
    @Inject("ICheckInScheduleRepository")
    private readonly scheduleRepository: ICheckInScheduleRepository,
  ) {}

  async execute(): Promise<PurgeLocationDataResult> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    this.logger.log(
      `RN10 — Iniciando purga de dados de localização anteriores a ${cutoffDate.toISOString()}`,
    );

    const [checkInsDeleted, schedulesDeleted] = await Promise.all([
      this.checkInRepository.deleteCreatedBefore(cutoffDate),
      this.scheduleRepository.deleteCreatedBefore(cutoffDate),
    ]);

    this.logger.log(
      `RN10 — Purga concluída: ${checkInsDeleted} check-ins e ${schedulesDeleted} agendamentos removidos`,
    );

    return { checkInsDeleted, schedulesDeleted, cutoffDate };
  }
}
