import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

@Injectable()
export class GetAllEmergencyAlertsUseCase {
  constructor(private emergencyAlertRepository: EmergencyAlertRepository) {}

  async execute(): Promise<EmergencyAlert[]> {
    return this.emergencyAlertRepository.findAll();
  }
}
