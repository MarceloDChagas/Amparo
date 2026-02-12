import { Inject, Injectable } from "@nestjs/common";

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import type { IAggressorRepository } from "@/core/domain/repositories/aggressor-repository.interface";

@Injectable()
export class GetAggressorUseCase {
  constructor(
    @Inject("AggressorRepository")
    private aggressorRepository: IAggressorRepository,
  ) {}

  async execute(id: string): Promise<Aggressor | null> {
    return this.aggressorRepository.findById(id);
  }

  async executeFindAll(): Promise<Aggressor[]> {
    return this.aggressorRepository.findAll();
  }
}
