import { Inject, Injectable } from "@nestjs/common";

import { Victim } from "@/core/domain/entities/victim.entity";
import type { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";

@Injectable()
export class CreateVictimUseCase {
  constructor(
    @Inject("IVictimRepository")
    private victimRepository: IVictimRepository,
  ) {}

  async execute(victim: Victim): Promise<Victim> {
    return this.victimRepository.create(victim);
  }
}
