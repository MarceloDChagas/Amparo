import { Inject, Injectable } from "@nestjs/common";

import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";

@Injectable()
export class DeleteEmergencyContactUseCase {
  constructor(
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.emergencyContactRepository.delete(id);
  }
}
