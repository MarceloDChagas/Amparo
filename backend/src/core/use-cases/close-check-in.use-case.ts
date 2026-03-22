import { Inject, Injectable } from "@nestjs/common";

import {
  CheckInRecord,
  CheckInRepository,
} from "@/core/domain/repositories/check-in-repository";
import { CheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

/**
 * RF03 / RN03 — Admin fecha manualmente um check-in LATE.
 * Útil quando o Admin contacta a usuária e confirma que está bem,
 * ou quando decide encerrar o acompanhamento por outro motivo.
 */
@Injectable()
export class CloseCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
  ) {}

  async execute(checkInId: string): Promise<CheckInRecord> {
    const checkIn = await this.checkInRepository.findById(checkInId);
    if (!checkIn) {
      throw new CheckInNotFoundError(checkInId);
    }
    return this.checkInRepository.closeByAdmin(checkInId);
  }
}
