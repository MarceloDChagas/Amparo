import { Inject, Injectable } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import type { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";

@Injectable()
export class GetOccurrenceUseCase {
  constructor(
    @Inject("IOccurrenceRepository")
    private readonly occurrenceRepository: IOccurrenceRepository,
  ) {}

  async execute(): Promise<Occurrence[]> {
    return this.occurrenceRepository.findAll();
  }
}
