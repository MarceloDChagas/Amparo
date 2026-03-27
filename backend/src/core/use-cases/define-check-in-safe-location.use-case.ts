import { Inject, Injectable } from "@nestjs/common";

import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";
import type {
  CreateCheckInScheduleData,
  ICheckInScheduleRepository,
} from "@/core/domain/repositories/check-in-schedule-repository.interface";

/**
 * AM-155 — DefineCheckInSafeLocation
 *
 * Permite que a usuária registre um destino com horário esperado de chegada.
 * O sistema monitora automaticamente se ela chegou dentro do prazo (windowMinutes).
 * Se não houver confirmação, um EmergencyAlert é disparado automaticamente (AM-162).
 */
@Injectable()
export class DefineCheckInSafeLocationUseCase {
  constructor(
    @Inject("ICheckInScheduleRepository")
    private readonly scheduleRepository: ICheckInScheduleRepository,
  ) {}

  async execute(data: CreateCheckInScheduleData): Promise<CheckInSchedule> {
    return this.scheduleRepository.create(data);
  }
}
