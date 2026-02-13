import { Inject, Injectable } from "@nestjs/common";

import { Victim } from "@/core/domain/entities/victim.entity";
import type { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";

@Injectable()
export class UpdateVictimUseCase {
  constructor(
    @Inject("IVictimRepository")
    private victimRepository: IVictimRepository,
  ) {}

  async execute(id: string, victim: Partial<Victim>): Promise<Victim> {
    return this.victimRepository.update(id, victim);
  }
}
