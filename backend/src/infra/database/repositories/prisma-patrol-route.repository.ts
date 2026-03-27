import { Injectable, Logger } from "@nestjs/common";
import {
  PatrolRoute as PrismaRoute,
  PatrolRouteLog as PrismaLog,
} from "@prisma/client";

import type {
  PatrolRoute,
  PatrolRouteEvent,
  PatrolRouteLogEntry,
  PatrolRouteStatus,
  Waypoint,
} from "@/core/domain/entities/patrol-route.entity";
import type {
  CreatePatrolRouteData,
  IPatrolRouteRepository,
  UpdatePatrolRouteStatusData,
} from "@/core/domain/repositories/patrol-route-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaPatrolRouteRepository implements IPatrolRouteRepository {
  private readonly logger = new Logger(PrismaPatrolRouteRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private mapLog(log: PrismaLog): PatrolRouteLogEntry {
    return {
      id: log.id,
      patrolRouteId: log.patrolRouteId,
      event: log.event as PatrolRouteEvent,
      performedBy: log.performedBy,
      metadata: log.metadata,
      createdAt: log.createdAt,
    };
  }

  private map(row: PrismaRoute & { logs?: PrismaLog[] }): PatrolRoute {
    const waypoints = JSON.parse(row.waypoints) as Waypoint[];
    return {
      id: row.id,
      name: row.name,
      waypoints,
      status: row.status as PatrolRouteStatus,
      assignedTo: row.assignedTo,
      generatedBy: row.generatedBy,
      scheduledAt: row.scheduledAt,
      startedAt: row.startedAt,
      completedAt: row.completedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      logs: row.logs?.map((l) => this.mapLog(l)),
    };
  }

  async create(data: CreatePatrolRouteData): Promise<PatrolRoute> {
    const row = await this.prisma.patrolRoute.create({
      data: {
        name: data.name,
        waypoints: JSON.stringify(data.waypoints),
        generatedBy: data.generatedBy,
        assignedTo: data.assignedTo,
        scheduledAt: data.scheduledAt,
      },
      include: { logs: true },
    });
    return this.map(row);
  }

  async findAll(): Promise<PatrolRoute[]> {
    const rows = await this.prisma.patrolRoute.findMany({
      orderBy: { createdAt: "desc" },
      include: { logs: { orderBy: { createdAt: "asc" } } },
    });
    return rows.map((r) => this.map(r));
  }

  async findById(id: string): Promise<PatrolRoute | null> {
    const row = await this.prisma.patrolRoute.findUnique({
      where: { id },
      include: { logs: { orderBy: { createdAt: "asc" } } },
    });
    return row ? this.map(row) : null;
  }

  async findByStatus(status: PatrolRouteStatus): Promise<PatrolRoute[]> {
    const rows = await this.prisma.patrolRoute.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: { logs: { orderBy: { createdAt: "asc" } } },
    });
    return rows.map((r) => this.map(r));
  }

  async updateStatus(
    id: string,
    data: UpdatePatrolRouteStatusData,
  ): Promise<PatrolRoute> {
    const row = await this.prisma.patrolRoute.update({
      where: { id },
      data: {
        status: data.status,
        startedAt: data.startedAt,
        completedAt: data.completedAt,
      },
      include: { logs: { orderBy: { createdAt: "asc" } } },
    });
    return this.map(row);
  }

  async assignTo(id: string, agentId: string): Promise<PatrolRoute> {
    const row = await this.prisma.patrolRoute.update({
      where: { id },
      data: { assignedTo: agentId },
      include: { logs: { orderBy: { createdAt: "asc" } } },
    });
    return this.map(row);
  }

  async addLog(
    patrolRouteId: string,
    event: PatrolRouteEvent,
    options?: { performedBy?: string; metadata?: Record<string, unknown> },
  ): Promise<void> {
    try {
      await this.prisma.patrolRouteLog.create({
        data: {
          patrolRouteId,
          event,
          performedBy: options?.performedBy,
          metadata: options?.metadata
            ? JSON.stringify(options.metadata)
            : undefined,
        },
      });
    } catch (err) {
      this.logger.error(
        `Falha ao registrar log da rota ${patrolRouteId}: ${String(err)}`,
      );
    }
  }
}
