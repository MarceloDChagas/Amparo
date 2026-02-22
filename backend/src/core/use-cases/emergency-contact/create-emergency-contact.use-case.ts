import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";

@Injectable()
export class CreateEmergencyContactUseCase {
  constructor(
    @Inject("IEmergencyContactRepository")
    private emergencyContactRepository: IEmergencyContactRepository,
  ) {}

  async execute(contact: EmergencyContact): Promise<EmergencyContact> {
    const userContacts = await this.emergencyContactRepository.findByUserId(
      contact.userId,
    );

    if (userContacts.length >= 3) {
      throw new BadRequestException(
        "O limite máximo é de 3 contatos de confiança por usuária.",
      );
    }

    return this.emergencyContactRepository.create(contact);
  }
}
