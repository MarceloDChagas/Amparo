import { Injectable } from "@nestjs/common";
import { CheckInSchedule as PrismaSchedule } from "@prisma/client";

import { CheckInSchedule } from "@/core/domain/entities/check-in-schedule.entity";
import type {
  CreateCheckInScheduleData,
  ICheckInScheduleRepository,
} from "@/core/domain/repositories/check-in-schedule-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaCheckInScheduleRepository implements ICheckInScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private map(row: PrismaSchedule): CheckInSchedule {
    return new CheckInSchedule({
      id: row.id,
      userId: row.userId,
      name: row.name,
      destinationAddress: row.destinationAddress,
      destinationLat: row.destinationLat,
      destinationLng: row.destinationLng,
      expectedArrivalAt: row.expectedArrivalAt,
      windowMinutes: row.windowMinutes,
      status: row.status as CheckInSchedule["status"],
      alertedAt: row.alertedAt,
      arrivedAt: row.arrivedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async create(data: CreateCheckInScheduleData): Promise<CheckInSchedule> {
    const row = await this.prisma.checkInSchedule.create({
      data: {
        userId: data.userId,
        name: data.name,
        destinationAddress: data.destinationAddress,
        destinationLat: data.destinationLat,
        destinationLng: data.destinationLng,
        expectedArrivalAt: data.expectedArrivalAt,
        windowMinutes: data.windowMinutes ?? 15,
      },
    });
    return this.map(row);
  }

  async findByUserId(userId: string): Promise<CheckInSchedule[]> {
    const rows = await this.prisma.checkInSchedule.findMany({
      where: { userId },
      orderBy: { expectedArrivalAt: "desc" },
    });
    return rows.map((r) => this.map(r));
  }

  async findById(id: string): Promise<CheckInSchedule | null> {
    const row = await this.prisma.checkInSchedule.findUnique({ where: { id } });
    return row ? this.map(row) : null;
  }

  async findPendingExpired(now: Date): Promise<CheckInSchedule[]> {
    const rows = await this.prisma.checkInSchedule.findMany({
      where: {
        status: "PENDING",
        expectedArrivalAt: { lt: now },
      },
    });
    return rows.map((r) => this.map(r));
  }

  async markAsArrived(id: string, arrivedAt: Date): Promise<CheckInSchedule> {
    const row = await this.prisma.checkInSchedule.update({
      where: { id },
      data: { status: "ARRIVED", arrivedAt },
    });
    return this.map(row);
  }

  async markAsAlerted(id: string, alertedAt: Date): Promise<CheckInSchedule> {
    const row = await this.prisma.checkInSchedule.update({
      where: { id },
      data: { status: "ALERTED", alertedAt },
    });
    return this.map(row);
  }

  async markAsCancelled(id: string): Promise<CheckInSchedule> {
    const row = await this.prisma.checkInSchedule.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return this.map(row);
  }
}
