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

export interface AlertEvent {
  id: string;
  alertId: string;
  type: string;
  source: string;
  message: string;
  metadata: string | null;
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
  async getAll(): Promise<EmergencyAlert[]> {
    const response = await fetch(`${API_URL}/emergency-alerts/all`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error("Failed to fetch all emergency alerts");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  },

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

  async getById(id: string): Promise<EmergencyAlert | null> {
    const response = await fetch(`${API_URL}/emergency-alerts/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch emergency alert ${id}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  async getEvents(id: string): Promise<AlertEvent[]> {
    const response = await fetch(`${API_URL}/emergency-alerts/${id}/events`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch events for alert ${id}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  },
};
