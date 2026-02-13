import { Inject, Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";

@Injectable()
export class UpdateEmergencyContactUseCase {
  constructor(
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
  ) {}

  async execute(
    id: string,
    contact: Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    return this.emergencyContactRepository.update(id, contact);
  }
}
