const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface EmergencyAlert {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  status: string;
  userId?: string;
  createdAt: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const emergencyAlertService = {
  async getActive(): Promise<EmergencyAlert | null> {
    const response = await fetch(`${API_URL}/emergency-alerts/active`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch active emergency alert");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },
};
