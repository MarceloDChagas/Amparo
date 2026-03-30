export type PatrolRouteStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Waypoint {
  order: number;
  latitude: number;
  longitude: number;
  riskScore: number;
}

export interface PatrolRouteLogEntry {
  id: string;
  patrolRouteId: string;
  event: PatrolRouteEvent;
  performedBy?: string | null;
  metadata?: string | null;
  createdAt: Date;
}

export type PatrolRouteEvent =
  | "GENERATED"
  | "ASSIGNED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"
  | "UPDATED";

export class PatrolRoute {
  id: string;
  name: string;
  waypoints: Waypoint[];
  /** Geometria real das ruas via OSRM: Array de [longitude, latitude] */
  routeGeometry?: [number, number][] | null;
  status: PatrolRouteStatus;
  assignedTo?: string | null;
  generatedBy?: string | null;
  scheduledAt?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  logs?: PatrolRouteLogEntry[];

  constructor(
    props: Omit<PatrolRoute, "logs"> & { logs?: PatrolRouteLogEntry[] },
  ) {
    Object.assign(this, props);
  }
}
