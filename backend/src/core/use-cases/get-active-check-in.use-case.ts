import { Inject, Injectable } from "@nestjs/common";

import { CheckInRepository } from "@/core/domain/repositories/check-in-repository";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

@Injectable()
export class GetActiveCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private readonly checkInRepository: CheckInRepository,
  ) {}

  async execute(userId: string) {
    return this.checkInRepository.findActiveByUserId(userId);
  }
}
