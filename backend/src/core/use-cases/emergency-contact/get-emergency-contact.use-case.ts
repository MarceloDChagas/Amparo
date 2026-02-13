import { Inject, Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";

@Injectable()
export class GetEmergencyContactUseCase {
  constructor(
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
  ) {}

  async execute(id: string): Promise<EmergencyContact | null> {
    return this.emergencyContactRepository.findById(id);
  }

  async executeFindAll(): Promise<EmergencyContact[]> {
    return this.emergencyContactRepository.findAll();
  }

  async executeFindByVictimId(victimId: string): Promise<EmergencyContact[]> {
    return this.emergencyContactRepository.findByVictimId(victimId);
  }
}
