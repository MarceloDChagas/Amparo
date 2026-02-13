import { Inject, Injectable } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import type { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";

@Injectable()
export class CreateOccurrenceUseCase {
  constructor(
    @Inject("IOccurrenceRepository")
    private readonly occurrenceRepository: IOccurrenceRepository,
  ) {}

  async execute(occurrence: Occurrence): Promise<Occurrence> {
    return this.occurrenceRepository.create(occurrence);
  }
}
