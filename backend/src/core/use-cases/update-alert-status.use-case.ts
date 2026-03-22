import { Injectable } from "@nestjs/common";

import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import {
  CancellationReasonRequiredError,
  EmergencyAlertNotFoundError,
  InvalidAlertStatusTransitionError,
} from "@/core/errors/emergency-alert.errors";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

import { RecordAlertEventUseCase } from "./record-alert-event.use-case";

interface UpdateAlertStatusRequest {
  alertId: string;
  status: AlertStatus;
  cancellationReason?: string;
}

const STATUS_LABELS: Record<AlertStatus, string> = {
  [AlertStatus.PENDING]: "Recebido",
  [AlertStatus.DISPATCHED]: "Viatura Despachada",
  [AlertStatus.COMPLETED]: "Concluído",
  [AlertStatus.CANCELLED]: "Cancelado",
};

@Injectable()
export class UpdateAlertStatusUseCase {
  constructor(
    private readonly alertRepository: EmergencyAlertRepository,
    private readonly recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async execute(request: UpdateAlertStatusRequest): Promise<void> {
    const alert = await this.alertRepository.findById(request.alertId);

    if (!alert) {
      throw new EmergencyAlertNotFoundError(request.alertId);
    }

    if (!alert.canTransitionTo(request.status)) {
      throw new InvalidAlertStatusTransitionError(alert.status, request.status);
    }

    if (
      request.status === AlertStatus.CANCELLED &&
      !request.cancellationReason
    ) {
      throw new CancellationReasonRequiredError();
    }

    const cancellationReason =
      request.status === AlertStatus.CANCELLED
        ? request.cancellationReason
        : null;

    await this.alertRepository.updateStatus(
      request.alertId,
      request.status,
      cancellationReason,
    );

    const message = `Status alterado: ${STATUS_LABELS[alert.status]} → ${STATUS_LABELS[request.status]}`;

    const metadata: Record<string, string> = {
      previousStatus: alert.status,
      newStatus: request.status,
    };

    if (cancellationReason) {
      metadata.cancellationReason = cancellationReason;
    }

    await this.recordAlertEvent.execute({
      alertId: request.alertId,
      type: AlertEventType.STATUS_CHANGE,
      source: EventSource.ADMIN,
      message,
      metadata: JSON.stringify(metadata),
    });
  }
}
