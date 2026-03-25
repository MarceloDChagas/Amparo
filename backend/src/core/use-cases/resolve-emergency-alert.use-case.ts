import { Injectable } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import { EmergencyAlertNotFoundError } from "@/core/errors/emergency-alert.errors";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

interface ResolveEmergencyAlertRequest {
  alertId: string;
  resolvedBy?: string;
}

/**
 * Encerra um alerta de emergência pelo Admin (status → COMPLETED).
 * Usa a máquina de estados do ciclo de vida do alerta (AlertStatus).
 */
@Injectable()
export class ResolveEmergencyAlertUseCase {
  constructor(
    private readonly alertRepository: EmergencyAlertRepository,
    private readonly recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async execute({
    alertId,
    resolvedBy,
  }: ResolveEmergencyAlertRequest): Promise<EmergencyAlert> {
    const existing = await this.alertRepository.findById(alertId);
    if (!existing) throw new EmergencyAlertNotFoundError(alertId);

    await this.alertRepository.updateStatus(alertId, AlertStatus.COMPLETED);

    await this.recordAlertEvent.execute({
      alertId,
      type: AlertEventType.STATUS_CHANGE,
      source: EventSource.ADMIN,
      message: resolvedBy
        ? `Alerta encerrado por ${resolvedBy}.`
        : "Alerta encerrado pelo operador.",
      metadata: JSON.stringify({
        from: existing.status,
        to: AlertStatus.COMPLETED,
      }),
    });

    return new EmergencyAlert(
      existing.id,
      existing.latitude,
      existing.longitude,
      existing.createdAt,
      AlertStatus.COMPLETED,
      existing.address,
      existing.userId,
      existing.cancellationReason,
    );
  }
}
