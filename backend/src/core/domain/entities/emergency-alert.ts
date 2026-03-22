import {
  AlertStatus,
  VALID_TRANSITIONS,
} from "@/core/domain/enums/alert-status.enum";

export class EmergencyAlert {
  constructor(
    public readonly id: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly createdAt: Date,
    public readonly status: AlertStatus,
    public readonly address?: string | null,
    public readonly userId?: string | null,
    public readonly cancellationReason?: string | null,
  ) {}

  canTransitionTo(newStatus: AlertStatus): boolean {
    return VALID_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
  }

  static create(
    props: Omit<
      EmergencyAlert,
      "id" | "createdAt" | "status" | "cancellationReason" | "canTransitionTo"
    >,
    id?: string,
    createdAt?: Date,
    status?: AlertStatus,
  ): EmergencyAlert {
    return new EmergencyAlert(
      id ?? crypto.randomUUID(),
      props.latitude,
      props.longitude,
      createdAt ?? new Date(),
      status ?? AlertStatus.PENDING,
      props.address,
      props.userId,
      null,
    );
  }
}
