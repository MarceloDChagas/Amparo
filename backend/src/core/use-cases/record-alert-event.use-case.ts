import { Injectable } from "@nestjs/common";

import { AlertEvent } from "@/core/domain/entities/alert-event";
import {
  AlertEventType,
  EventSource,
} from "@/core/domain/enums/alert-event.enum";
import { AlertEventRepository } from "@/core/repositories/alert-event-repository";

interface RecordAlertEventRequest {
  alertId: string;
  type: AlertEventType;
  source?: EventSource;
  message: string;
  metadata?: string | null;
}

@Injectable()
export class RecordAlertEventUseCase {
  constructor(private readonly eventRepository: AlertEventRepository) {}

  async execute(request: RecordAlertEventRequest): Promise<AlertEvent> {
    const event = AlertEvent.create({
      alertId: request.alertId,
      type: request.type,
      source: request.source,
      message: request.message,
      metadata: request.metadata,
    });

    await this.eventRepository.save(event);

    return event;
  }
}
