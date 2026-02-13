import { Inject, Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";

@Injectable()
export class CreateEmergencyContactUseCase {
  constructor(
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
  ) {}

  async execute(contact: EmergencyContact): Promise<EmergencyContact> {
    return this.emergencyContactRepository.create(contact);
  }
}
