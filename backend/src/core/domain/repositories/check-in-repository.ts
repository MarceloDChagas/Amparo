import {
  CheckInStatus,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { Role } from "@/core/domain/enums/role.enum";

export interface CheckInUserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

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
  // RN03 — escalonamento progressivo
  overdueAt?: Date | null;
  escalationStage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActiveCheckInRecord extends CheckInRecord {
  user: CheckInUserSummary;
}

export interface CheckInDetailsRecord extends ActiveCheckInRecord {
  userCheckInCount: number;
}

export interface LateCheckInRecord extends CheckInRecord {
  user: CheckInUserSummary;
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
  findAllActive(): Promise<ActiveCheckInRecord[]>;
  findAllLate(): Promise<LateCheckInRecord[]>;
  /** RN03 — busca check-ins LATE no estágio dado cujo overdueAt <= threshold */
  findLateForEscalation(
    stage: number,
    overdueAtBefore: Date,
  ): Promise<LateCheckInRecord[]>;
  findById(id: string): Promise<CheckInRecord | null>;
  findDetailedById(id: string): Promise<CheckInDetailsRecord | null>;
  findByUserId(userId: string): Promise<CheckInRecord[]>;
  create(data: CreateCheckInData): Promise<CheckInRecord>;
  complete(
    checkInId: string,
    data: CompleteCheckInData,
  ): Promise<CheckInRecord>;
  /** RN03 — avança o estágio de escalonamento; define overdueAt na transição 0→1 */
  updateEscalation(id: string, stage: number, overdueAt?: Date): Promise<void>;
  /** Admin fecha manualmente um check-in LATE */
  closeByAdmin(id: string): Promise<CheckInRecord>;
}
