import { Inject, Injectable } from "@nestjs/common";

import type { IAggressorRepository } from "@/core/domain/repositories/aggressor-repository.interface";

@Injectable()
export class DeleteAggressorUseCase {
  constructor(
    @Inject("AggressorRepository")
    private aggressorRepository: IAggressorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.aggressorRepository.delete(id);
  }
}
