import { Inject, Injectable } from "@nestjs/common";

import { CheckInRepository } from "@/core/domain/repositories/check-in-repository";
import { CheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

@Injectable()
export class GetCheckInByIdUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
  ) {}

  async execute(id: string) {
    const checkIn = await this.checkInRepository.findDetailedById(id);

    if (!checkIn) {
      throw new CheckInNotFoundError();
    }

    return checkIn;
  }
}
