import { AlertEvent } from "@/core/domain/entities/alert-event";

export abstract class AlertEventRepository {
  abstract save(event: AlertEvent): Promise<AlertEvent>;
  abstract findByAlertId(alertId: string): Promise<AlertEvent[]>;
}
