import { Injectable } from "@nestjs/common";

import { DistanceType } from "@/core/domain/enums/distance-type.enum";
import { Role } from "@/core/domain/enums/role.enum";
import {
  ActiveCheckInRecord,
  CheckInDetailsRecord,
  CheckInRecord,
  CheckInRepository,
  CompleteCheckInData,
  CreateCheckInData,
  LateCheckInRecord,
} from "@/core/domain/repositories/check-in-repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaCheckInRepository implements CheckInRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByUserId(userId: string): Promise<CheckInRecord | null> {
    const data = await this.prisma.checkIn.findFirst({
      where: { userId, status: "ACTIVE" },
    });
    return data ? this.toCheckInRecord(data) : null;
  }

  async findAllActive(): Promise<ActiveCheckInRecord[]> {
    const records = await this.prisma.checkIn.findMany({
      where: { status: "ACTIVE" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return records.map((r) => ({
      ...this.toCheckInRecord(r),
      user: this.toCheckInUserSummary(r.user),
    }));
  }

  async findAllLate(): Promise<LateCheckInRecord[]> {
    const records = await this.prisma.checkIn.findMany({
      where: { status: "LATE" },
      include: { user: true },
      orderBy: { overdueAt: "asc" },
    });
    return records.map((r) => ({
      ...this.toCheckInRecord(r),
      user: this.toCheckInUserSummary(r.user),
    }));
  }

  /** RN03 — busca check-ins LATE no estágio exato cujo overdueAt <= threshold */
  async findLateForEscalation(
    stage: number,
    overdueAtBefore: Date,
  ): Promise<LateCheckInRecord[]> {
    const records = await this.prisma.checkIn.findMany({
      where: {
        status: "LATE",
        escalationStage: stage,
        overdueAt: { lte: overdueAtBefore },
      },
      include: { user: true },
    });
    return records.map((r) => ({
      ...this.toCheckInRecord(r),
      user: this.toCheckInUserSummary(r.user),
    }));
  }

  async findById(id: string): Promise<CheckInRecord | null> {
    const data = await this.prisma.checkIn.findUnique({ where: { id } });
    return data ? this.toCheckInRecord(data) : null;
  }

  async findDetailedById(id: string): Promise<CheckInDetailsRecord | null> {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!checkIn) return null;

    const userCheckInCount = await this.prisma.checkIn.count({
      where: { userId: checkIn.userId, status: { in: ["ON_TIME", "LATE"] } },
    });

    return {
      ...this.toCheckInRecord(checkIn),
      user: this.toCheckInUserSummary(checkIn.user),
      userCheckInCount,
    };
  }

  async findByUserId(userId: string): Promise<CheckInRecord[]> {
    const data = await this.prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return data.map((item) => this.toCheckInRecord(item));
  }

  async create(data: CreateCheckInData): Promise<CheckInRecord> {
    const created = await this.prisma.checkIn.create({
      data: {
        userId: data.userId,
        distanceType: data.distanceType,
        startTime: data.startTime,
        expectedArrivalTime: data.expectedArrivalTime,
        startLatitude: data.startLatitude,
        startLongitude: data.startLongitude,
        status: data.status,
      },
    });
    return this.toCheckInRecord(created);
  }

  async complete(
    checkInId: string,
    data: CompleteCheckInData,
  ): Promise<CheckInRecord> {
    const updated = await this.prisma.checkIn.update({
      where: { id: checkInId },
      data: {
        actualArrivalTime: data.actualArrivalTime,
        finalLatitude: data.finalLatitude,
        finalLongitude: data.finalLongitude,
        status: data.status,
      },
    });
    return this.toCheckInRecord(updated);
  }

  /** RN03 — avança o estágio; define overdueAt quando transiciona de ACTIVE→LATE */
  async updateEscalation(
    id: string,
    stage: number,
    overdueAt?: Date,
  ): Promise<void> {
    await this.prisma.checkIn.update({
      where: { id },
      data: {
        escalationStage: stage,
        status: "LATE",
        ...(overdueAt ? { overdueAt } : {}),
      },
    });
  }

  /** Admin fecha manualmente um check-in LATE (sem confirmação de chegada) */
  async closeByAdmin(id: string): Promise<CheckInRecord> {
    const updated = await this.prisma.checkIn.update({
      where: { id },
      data: {
        status: "CANCELLED",
        actualArrivalTime: new Date(),
      },
    });
    return this.toCheckInRecord(updated);
  }

  private toCheckInRecord(data: {
    id: string;
    userId: string;
    startTime: Date;
    expectedArrivalTime: Date;
    actualArrivalTime: Date | null;
    startLatitude: number | null;
    startLongitude: number | null;
    finalLatitude: number | null;
    finalLongitude: number | null;
    distanceType: string;
    status: string;
    overdueAt?: Date | null;
    escalationStage?: number;
    createdAt: Date;
    updatedAt: Date;
  }): CheckInRecord {
    return {
      id: data.id,
      userId: data.userId,
      startTime: data.startTime,
      expectedArrivalTime: data.expectedArrivalTime,
      actualArrivalTime: data.actualArrivalTime,
      startLatitude: data.startLatitude,
      startLongitude: data.startLongitude,
      finalLatitude: data.finalLatitude,
      finalLongitude: data.finalLongitude,
      distanceType: data.distanceType as DistanceType,
      status: data.status as CheckInRecord["status"],
      overdueAt: data.overdueAt ?? null,
      escalationStage: data.escalationStage ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private isCheckInUserSummaryData(data: unknown): data is {
    id: string;
    name: string;
    email: string;
    role: string;
  } {
    if (!data || typeof data !== "object") return false;

    const candidate = data as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.email === "string" &&
      typeof candidate.role === "string"
    );
  }

  private toCheckInUserSummary(data: unknown) {
    if (!this.isCheckInUserSummaryData(data)) {
      throw new Error("Invalid check-in user payload");
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as Role,
    };
  }
}
