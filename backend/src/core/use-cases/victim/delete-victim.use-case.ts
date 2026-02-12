import { Inject, Injectable } from "@nestjs/common";

import type { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";

@Injectable()
export class DeleteVictimUseCase {
  constructor(
    @Inject("IVictimRepository")
    private victimRepository: IVictimRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.victimRepository.delete(id);
  }
}
