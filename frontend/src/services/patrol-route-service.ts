const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

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

export interface PatrolRouteLog {
  id: string;
  patrolRouteId: string;
  event: string;
  performedBy?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export interface PatrolRoute {
  id: string;
  name: string;
  waypoints: Waypoint[];
  status: PatrolRouteStatus;
  assignedTo?: string | null;
  generatedBy?: string | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  logs?: PatrolRouteLog[];
}

export interface GeneratePatrolRouteInput {
  name: string;
  maxWaypoints?: number;
  vehicleLatitude?: number;
  vehicleLongitude?: number;
  assignedTo?: string;
  scheduledAt?: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: getAuthHeaders(), ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const patrolRouteService = {
  /** AM-83 + AM-85 + AM-82 + AM-84 — Gera rota baseada no mapa de calor */
  async generate(input: GeneratePatrolRouteInput): Promise<PatrolRoute> {
    return fetchJSON<PatrolRoute>(`${API_URL}/patrol-routes/generate`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async getAll(): Promise<PatrolRoute[]> {
    return fetchJSON<PatrolRoute[]>(`${API_URL}/patrol-routes`);
  },

  async getById(id: string): Promise<PatrolRoute> {
    return fetchJSON<PatrolRoute>(`${API_URL}/patrol-routes/${id}`);
  },

  async updateStatus(
    id: string,
    status: PatrolRouteStatus,
  ): Promise<PatrolRoute> {
    return fetchJSON<PatrolRoute>(`${API_URL}/patrol-routes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async assign(id: string, agentId: string): Promise<PatrolRoute> {
    return fetchJSON<PatrolRoute>(`${API_URL}/patrol-routes/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ agentId }),
    });
  },
};
