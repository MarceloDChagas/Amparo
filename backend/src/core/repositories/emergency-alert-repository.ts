import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";

export abstract class EmergencyAlertRepository {
  abstract create(alert: EmergencyAlert): Promise<void>;
}
