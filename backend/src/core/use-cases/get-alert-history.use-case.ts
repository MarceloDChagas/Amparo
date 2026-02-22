import { Injectable } from "@nestjs/common";

import { AlertEvent } from "../domain/entities/alert-event";
import { AlertEventRepository } from "../repositories/alert-event-repository";

interface GetAlertHistoryRequest {
  alertId: string;
}

@Injectable()
export class GetAlertHistoryUseCase {
  constructor(private readonly eventRepository: AlertEventRepository) {}

  async execute(request: GetAlertHistoryRequest): Promise<AlertEvent[]> {
    return this.eventRepository.findByAlertId(request.alertId);
  }
}
