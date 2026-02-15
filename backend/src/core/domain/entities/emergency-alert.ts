export class EmergencyAlert {
  constructor(
    public readonly id: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly createdAt: Date,
    public readonly status: string,
    public readonly address?: string | null,
    public readonly victimId?: string | null,
  ) {}

  static create(
    props: Omit<EmergencyAlert, "id" | "createdAt" | "status">,
    id?: string,
    createdAt?: Date,
    status?: string,
  ): EmergencyAlert {
    return new EmergencyAlert(
      id ?? crypto.randomUUID(),
      props.latitude,
      props.longitude,
      createdAt ?? new Date(),
      status ?? "PENDING",
      props.address,
      props.victimId,
    );
  }
}
