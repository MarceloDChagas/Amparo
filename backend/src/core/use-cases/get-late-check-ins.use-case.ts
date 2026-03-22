import { Inject, Injectable } from "@nestjs/common";

import {
  CheckInRepository,
  LateCheckInRecord,
} from "@/core/domain/repositories/check-in-repository";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

/**
 * RF03 / RN03 — retorna todos os check-ins em estado LATE para o dashboard do Admin.
 * O Admin pode monitorar o estágio de escalonamento e agir manualmente.
 */
@Injectable()
export class GetLateCheckInsUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
  ) {}

  async execute(): Promise<LateCheckInRecord[]> {
    return this.checkInRepository.findAllLate();
  }
}
