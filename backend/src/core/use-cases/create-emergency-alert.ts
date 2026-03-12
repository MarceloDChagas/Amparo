import { Inject, Injectable, Logger } from "@nestjs/common";

import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import {
  EMERGENCY_ALERT_NOTIFICATION_PORT,
  EmergencyAlertNotificationPort,
} from "@/core/ports/emergency-alert-notification.ports";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

interface CreateEmergencyAlertRequest {
  latitude: number;
  longitude: number;
  address?: string;
  userId?: string;
}

@Injectable()
export class CreateEmergencyAlert {
  private readonly logger = new Logger(CreateEmergencyAlert.name);

  constructor(
    private emergencyAlertRepository: EmergencyAlertRepository,
    @Inject(EMERGENCY_ALERT_NOTIFICATION_PORT)
    private readonly emergencyAlertNotificationPort: EmergencyAlertNotificationPort,
    private recordAlertEvent: RecordAlertEventUseCase,
  ) {}

  async execute(request: CreateEmergencyAlertRequest): Promise<void> {
    const alert = EmergencyAlert.create({
      latitude: request.latitude,
      longitude: request.longitude,
      address: request.address,
      userId: request.userId,
    });

    await this.emergencyAlertRepository.create(alert);

    // Record CREATED event
    await this.recordAlertEvent.execute({
      alertId: alert.id,
      type: AlertEventType.CREATED,
      source: EventSource.USER,
      message: request.userId
        ? "Chamado originado pelo usuário"
        : "Chamado originado anonimamente",
      metadata: JSON.stringify({
        latitude: request.latitude,
        longitude: request.longitude,
        address: request.address,
      }),
    });

    this.logger.log(
      `Emergency Alert created: ${alert.id} at [${alert.latitude}, ${alert.longitude}]`,
    );

    await this.emergencyAlertNotificationPort.notify(alert);
  }
}
