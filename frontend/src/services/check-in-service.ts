const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export enum DistanceType {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
}

export interface CheckIn {
  id: string;
  startTime: string;
  expectedArrivalTime: string;
  actualArrivalTime: string | null;
  distanceType: DistanceType;
  status: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const checkInService = {
  async startCheckIn(distanceType: DistanceType): Promise<CheckIn> {
    const response = await fetch(`${API_URL}/check-ins/start`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ distanceType }),
    });

    if (!response.ok) {
      throw new Error("Failed to start check-in");
    }

    const text = await response.text();
    if (!text) throw new Error("Empty response");
    return JSON.parse(text);
  },

  async completeCheckIn(): Promise<CheckIn> {
    const response = await fetch(`${API_URL}/check-ins/complete`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to complete check-in");
    }

    const text = await response.text();
    if (!text) throw new Error("Empty response");
    return JSON.parse(text);
  },

  async getActiveCheckIn(): Promise<CheckIn | null> {
    try {
      const response = await fetch(`${API_URL}/check-ins/active`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch active check-in");
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      return null;
    }
  },
};
