import {
  CheckInStatus,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";

export interface CheckInRecord {
  id: string;
  userId: string;
  startTime: Date;
  expectedArrivalTime: Date;
  actualArrivalTime?: Date | null;
  startLatitude?: number | null;
  startLongitude?: number | null;
  finalLatitude?: number | null;
  finalLongitude?: number | null;
  distanceType: DistanceType;
  status: "ACTIVE" | CheckInStatus | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckInData {
  userId: string;
  distanceType: DistanceType;
  startTime: Date;
  expectedArrivalTime: Date;
  startLatitude?: number;
  startLongitude?: number;
  status: "ACTIVE";
}

export interface CompleteCheckInData {
  actualArrivalTime: Date;
  finalLatitude?: number;
  finalLongitude?: number;
  status: CheckInStatus;
}

export interface CheckInRepository {
  findActiveByUserId(userId: string): Promise<CheckInRecord | null>;
  findById(id: string): Promise<CheckInRecord | null>;
  findByUserId(userId: string): Promise<CheckInRecord[]>;
  create(data: CreateCheckInData): Promise<CheckInRecord>;
  complete(
    checkInId: string,
    data: CompleteCheckInData,
  ): Promise<CheckInRecord>;
}
