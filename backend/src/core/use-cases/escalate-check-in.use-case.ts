import { Inject, Injectable } from "@nestjs/common";

import {
  CheckInRecord,
  CheckInRepository,
} from "@/core/domain/repositories/check-in-repository";
import { CheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

/**
 * RF03 / RN03 — Admin escala manualmente um check-in para o próximo estágio,
 * sem aguardar o timer do cron. Permite agir antes dos limites de +15/+30/+45min.
 */
@Injectable()
export class EscalateCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
  ) {}

  async execute(checkInId: string): Promise<CheckInRecord> {
    const checkIn = await this.checkInRepository.findById(checkInId);
    if (!checkIn) {
      throw new CheckInNotFoundError();
    }

    const currentStage = checkIn.escalationStage ?? 0;
    const MAX_STAGE = 4;

    if (currentStage >= MAX_STAGE) {
      // Já no estágio máximo — retorna sem alterar
      return checkIn;
    }

    await this.checkInRepository.updateEscalation(checkInId, currentStage + 1);
    return { ...checkIn, escalationStage: currentStage + 1 };
  }
}
