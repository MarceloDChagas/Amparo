import { Inject, Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import { EmergencyContactLimitExceededError } from "@/core/errors/emergency-contact.errors";

/**
 * RF11 — Gestão de Contatos de Emergência (HIGH)
 * Permite à usuária cadastrar contatos de confiança que serão notificados
 * automaticamente em caso de alerta de emergência (RF01) ou check-in atrasado (RF03).
 *
 * RN09 — Limitação de Contatos de Emergência
 * Máximo de 3 contatos por usuária para controlar custo de infraestrutura
 * de envio de notificações (SMS/e-mail). Exceder o limite lança
 * `EmergencyContactLimitExceededError`.
 */
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

    // RN09 — impede cadastro além do limite de 3 contatos por usuária.
    if (userContacts.length >= 3) {
      throw new EmergencyContactLimitExceededError();
    }

    return this.emergencyContactRepository.create(contact);
  }
}
