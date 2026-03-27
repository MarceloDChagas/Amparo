import { Inject, Injectable } from "@nestjs/common";

import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";
import type { ICheckInScheduleRepository } from "@/core/domain/repositories/check-in-schedule-repository.interface";

/** AM-160 — Retorna os agendamentos de check-in inteligente da usuária. */
@Injectable()
export class GetCheckInSchedulesUseCase {
  constructor(
    @Inject("ICheckInScheduleRepository")
    private readonly scheduleRepository: ICheckInScheduleRepository,
  ) {}

  async execute(userId: string): Promise<CheckInSchedule[]> {
    return this.scheduleRepository.findByUserId(userId);
  }
}
