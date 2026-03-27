import { Inject, Injectable, Logger } from "@nestjs/common";

import type { ICheckInScheduleRepository } from "@/core/domain/repositories/check-in-schedule-repository.interface";
import { CheckInExpectedButNotArrivedError } from "@/core/errors/check-in.errors";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";

/**
 * AM-156 / AM-158 / AM-162 — MonitorCheckIn
 *
 * Job que verifica se a usuária chegou ao destino no horário esperado.
 *
 * Lógica (AM-158):
 *   Para cada schedule PENDING cujo expectedArrivalAt já passou:
 *   - Se (now - expectedArrivalAt) >= windowMinutes → lança CheckInExpectedButNotArrivedError
 *   - Cria EmergencyAlert automaticamente (AM-162)
 *   - Marca schedule como ALERTED
 *
 * Chamado pelo MonitorCheckInCron a cada minuto.
 */
@Injectable()
export class MonitorCheckInUseCase {
  private readonly logger = new Logger(MonitorCheckInUseCase.name);

  constructor(
    @Inject("ICheckInScheduleRepository")
    private readonly scheduleRepository: ICheckInScheduleRepository,
    private readonly createEmergencyAlert: CreateEmergencyAlert,
  ) {}

  async execute(): Promise<void> {
    const now = new Date();

    // Busca schedules PENDING cujo expectedArrivalAt já passou
    const expired = await this.scheduleRepository.findPendingExpired(now);

    for (const schedule of expired) {
      const deadline = new Date(
        schedule.expectedArrivalAt.getTime() + schedule.windowMinutes * 60_000,
      );

      // AM-158: janela de tolerância ainda não esgotada → ignora por esta rodada
      if (now < deadline) continue;

      try {
        // AM-161: sinaliza internamente que a usuária não chegou no prazo
        const err = new CheckInExpectedButNotArrivedError(schedule.id);
        this.logger.warn(err.message);

        // AM-162: cria EmergencyAlert automaticamente
        await this.createEmergencyAlert.execute({
          userId: schedule.userId,
          latitude: schedule.destinationLat,
          longitude: schedule.destinationLng,
          address:
            schedule.destinationAddress ??
            `Destino: ${schedule.name} (check-in não confirmado)`,
        });

        await this.scheduleRepository.markAsAlerted(schedule.id, now);

        this.logger.log(
          `EmergencyAlert disparado automaticamente para schedule ${schedule.id} (usuário ${schedule.userId})`,
        );
      } catch (err) {
        this.logger.error(
          `Erro ao processar schedule ${schedule.id}: ${String(err)}`,
        );
      }
    }
  }
}
