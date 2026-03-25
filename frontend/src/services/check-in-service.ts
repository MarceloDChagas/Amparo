const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export enum DistanceType {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
}

export interface CheckIn {
  id: string;
  userId: string;
  startTime: string;
  expectedArrivalTime: string;
  actualArrivalTime: string | null;
  startLatitude?: number;
  startLongitude?: number;
  finalLatitude?: number;
  finalLongitude?: number;
  distanceType: DistanceType;
  status: string;
  /** RN03 — campos de escalonamento */
  overdueAt?: string | null;
  escalationStage?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  userCheckInCount?: number;
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
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const checkInService = {
  async startCheckIn(
    distanceType: DistanceType,
    startLatitude?: number,
    startLongitude?: number,
  ): Promise<CheckIn> {
    return fetchJSON<CheckIn>(`${API_URL}/check-ins/start`, {
      method: "POST",
      body: JSON.stringify({ distanceType, startLatitude, startLongitude }),
    });
  },

  async completeCheckIn(
    finalLatitude?: number,
    finalLongitude?: number,
  ): Promise<CheckIn> {
    return fetchJSON<CheckIn>(`${API_URL}/check-ins/complete`, {
      method: "POST",
      body: JSON.stringify({ finalLatitude, finalLongitude }),
    });
  },

  async getActiveCheckIn(): Promise<CheckIn | null> {
    try {
      const res = await fetch(`${API_URL}/check-ins/active`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return null;
      const text = await res.text();
      return text ? (JSON.parse(text) as CheckIn) : null;
    } catch {
      return null;
    }
  },

  async getAllActive(): Promise<CheckIn[]> {
    try {
      return await fetchJSON<CheckIn[]>(`${API_URL}/check-ins/all-active`);
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /** RN03 — lista check-ins LATE com estágio de escalonamento (Admin) */
  async getAllLate(): Promise<CheckIn[]> {
    try {
      return await fetchJSON<CheckIn[]>(`${API_URL}/check-ins/late`);
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getById(id: string): Promise<CheckIn | null> {
    try {
      return await fetchJSON<CheckIn>(`${API_URL}/check-ins/${id}`);
    } catch {
      return null;
    }
  },

  /** RN03 — Admin encerra manualmente um check-in LATE */
  async close(id: string): Promise<CheckIn> {
    return fetchJSON<CheckIn>(`${API_URL}/check-ins/${id}/close`, {
      method: "PATCH",
    });
  },

  /** RN03 — Admin escala manualmente para o próximo estágio */
  async escalate(id: string): Promise<CheckIn> {
    return fetchJSON<CheckIn>(`${API_URL}/check-ins/${id}/escalate`, {
      method: "PATCH",
    });
  },
};
