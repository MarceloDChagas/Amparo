import type {
  PatrolRoute,
  PatrolRouteEvent,
  PatrolRouteStatus,
  Waypoint,
} from "@/core/domain/entities/patrol-route.entity";

export interface CreatePatrolRouteData {
  name: string;
  waypoints: Waypoint[];
  routeGeometry?: [number, number][] | null;
  generatedBy?: string;
  assignedTo?: string;
  scheduledAt?: Date;
}

export interface UpdatePatrolRouteStatusData {
  status: PatrolRouteStatus;
  startedAt?: Date;
  completedAt?: Date;
}

export interface IPatrolRouteRepository {
  create(data: CreatePatrolRouteData): Promise<PatrolRoute>;
  findAll(): Promise<PatrolRoute[]>;
  findById(id: string): Promise<PatrolRoute | null>;
  findByStatus(status: PatrolRouteStatus): Promise<PatrolRoute[]>;
  updateStatus(
    id: string,
    data: UpdatePatrolRouteStatusData,
  ): Promise<PatrolRoute>;
  assignTo(id: string, agentId: string): Promise<PatrolRoute>;

  /** AM-84 — Registrar evento no log da rota */
  addLog(
    patrolRouteId: string,
    event: PatrolRouteEvent,
    options?: { performedBy?: string; metadata?: Record<string, unknown> },
  ): Promise<void>;
}
