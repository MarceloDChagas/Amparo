import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { EmergencyAlertNotFoundError } from "@/core/errors/emergency-alert.errors";
import { AlertEventRepository } from "@/core/repositories/alert-event-repository";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

interface ResolveEmergencyAlertRequest {
  alertId: string;
  resolvedBy?: string;
}

@Injectable()
export class ResolveEmergencyAlertUseCase {
  constructor(
    private readonly alertRepository: EmergencyAlertRepository,
    private readonly eventRepository: AlertEventRepository,
    private readonly recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async execute({
    alertId,
    resolvedBy,
  }: ResolveEmergencyAlertRequest): Promise<EmergencyAlert> {
    const existing = await this.alertRepository.findById(alertId);
    if (!existing) throw new EmergencyAlertNotFoundError(alertId);

    const resolved = new EmergencyAlert(
      existing.id,
      existing.latitude,
      existing.longitude,
      existing.createdAt,
      "RESOLVED",
      existing.address,
      existing.userId,
    );

    await this.alertRepository.update(resolved);

    await this.recordAlertEvent.execute({
      alertId,
      type: AlertEventType.STATUS_CHANGE,
      source: EventSource.ADMIN,
      message: resolvedBy
        ? `Alerta de emergência encerrado por ${resolvedBy}.`
        : "Alerta de emergência encerrado pelo operador.",
      metadata: JSON.stringify({ from: existing.status, to: "RESOLVED" }),
    });

    return resolved;
  }
}
