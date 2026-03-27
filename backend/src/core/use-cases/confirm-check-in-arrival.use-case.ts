import { Inject, Injectable } from "@nestjs/common";

import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";
import type { ICheckInScheduleRepository } from "@/core/domain/repositories/check-in-schedule-repository.interface";
import {
  CheckInScheduleNotFoundError,
} from "@/core/errors/check-in.errors";

/**
 * Permite que a usuária confirme chegada ao destino, encerrando o monitoramento
 * e evitando o disparo automático do EmergencyAlert.
 */
@Injectable()
export class ConfirmCheckInArrivalUseCase {
  constructor(
    @Inject("ICheckInScheduleRepository")
    private readonly scheduleRepository: ICheckInScheduleRepository,
  ) {}

  async execute(scheduleId: string, userId: string): Promise<CheckInSchedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule || schedule.userId !== userId) {
      throw new CheckInScheduleNotFoundError();
    }

    return this.scheduleRepository.markAsArrived(scheduleId, new Date());
  }
}
