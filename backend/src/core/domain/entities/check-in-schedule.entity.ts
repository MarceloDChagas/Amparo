export type CheckInScheduleStatus =
  | "PENDING"
  | "ARRIVED"
  | "ALERTED"
  | "CANCELLED";

export class CheckInSchedule {
  id: string;
  userId: string;
  name: string;
  destinationAddress?: string | null;
  destinationLat: number;
  destinationLng: number;
  expectedArrivalAt: Date;
  windowMinutes: number;
  status: CheckInScheduleStatus;
  alertedAt?: Date | null;
  arrivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: CheckInSchedule) {
    Object.assign(this, props);
  }
}
