import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";

export abstract class EmergencyAlertRepository {
  abstract create(alert: EmergencyAlert): Promise<void>;
  abstract findActive(): Promise<EmergencyAlert | null>;
  abstract findById(id: string): Promise<EmergencyAlert | null>;
  abstract findAll(): Promise<EmergencyAlert[]>;
  abstract updateStatus(
    id: string,
    status: string,
    cancellationReason?: string | null,
  ): Promise<void>;
}
