import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { MonitorCheckInUseCase } from "@/core/use-cases/monitor-check-in.use-case";

/**
 * AM-156 — MonitorCheckIn cron
 * Roda a cada minuto e delega ao MonitorCheckInUseCase a verificação de schedules vencidos.
 */
@Injectable()
export class MonitorCheckInCron {
  private readonly logger = new Logger(MonitorCheckInCron.name);

  constructor(private readonly monitorCheckInUseCase: MonitorCheckInUseCase) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handle(): Promise<void> {
    try {
      await this.monitorCheckInUseCase.execute();
    } catch (err) {
      this.logger.error(
        `Erro no cron de monitoramento de check-in: ${String(err)}`,
      );
    }
  }
}
