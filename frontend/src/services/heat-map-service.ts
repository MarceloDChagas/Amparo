const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface HeatMapCell {
  id: string;
  cellKey: string;
  latitude: number;
  longitude: number;
  intensity: number;
  riskScore: number;
  lastOccurrence: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const heatMapService = {
  async getAll(): Promise<HeatMapCell[]> {
    const response = await fetch(`${API_URL}/heat-map`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch heat map cells");
    }
    return response.json();
  },
};
