import { Inject, Injectable } from "@nestjs/common";

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import type { IAggressorRepository } from "@/core/domain/repositories/aggressor-repository.interface";

@Injectable()
export class UpdateAggressorUseCase {
  constructor(
    @Inject("AggressorRepository")
    private aggressorRepository: IAggressorRepository,
  ) {}

  async execute(id: string, aggressor: Partial<Aggressor>): Promise<Aggressor> {
    return this.aggressorRepository.update(id, aggressor);
  }
}
