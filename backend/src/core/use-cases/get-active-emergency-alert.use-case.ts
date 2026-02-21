import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

@Injectable()
export class GetActiveEmergencyAlertUseCase {
  constructor(private emergencyAlertRepository: EmergencyAlertRepository) {}

  async execute(): Promise<EmergencyAlert | null> {
    return this.emergencyAlertRepository.findActive();
  }
}
