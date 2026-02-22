import { Injectable, NotFoundException } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

@Injectable()
export class GetEmergencyAlertByIdUseCase {
  constructor(private emergencyAlertRepository: EmergencyAlertRepository) {}

  async execute(id: string): Promise<EmergencyAlert> {
    const alert = await this.emergencyAlertRepository.findById(id);

    if (!alert) {
      throw new NotFoundException(
        `Alerta de emergência de ID ${id} não encontrado.`,
      );
    }

    return alert;
  }
}
