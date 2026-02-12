import { Inject, Injectable } from "@nestjs/common";

import { Victim } from "@/core/domain/entities/victim.entity";
import type { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";

@Injectable()
export class GetVictimUseCase {
  constructor(
    @Inject("IVictimRepository")
    private victimRepository: IVictimRepository,
  ) {}

  async execute(id: string): Promise<Victim | null> {
    return this.victimRepository.findById(id);
  }

  async executeFindAll(): Promise<Victim[]> {
    return this.victimRepository.findAll();
  }
}
