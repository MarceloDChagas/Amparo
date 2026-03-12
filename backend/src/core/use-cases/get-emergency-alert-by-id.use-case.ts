import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertNotFoundError } from "@/core/errors/emergency-alert.errors";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

@Injectable()
export class GetEmergencyAlertByIdUseCase {
  constructor(private emergencyAlertRepository: EmergencyAlertRepository) {}

  async execute(id: string): Promise<EmergencyAlert> {
    const alert = await this.emergencyAlertRepository.findById(id);

    if (!alert) {
      throw new EmergencyAlertNotFoundError(id);
    }

    return alert;
  }
}
