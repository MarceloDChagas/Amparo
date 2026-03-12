import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";

export const EMERGENCY_ALERT_NOTIFICATION_PORT = Symbol(
  "EmergencyAlertNotificationPort",
);

export interface EmergencyAlertNotificationPort {
  notify(alert: EmergencyAlert): Promise<void>;
}
