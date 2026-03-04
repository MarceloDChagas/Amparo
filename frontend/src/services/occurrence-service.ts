const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface Occurrence {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  aggressorId?: string | null;
  // Add other fields as needed
}

export interface CreateOccurrenceData {
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  aggressorId?: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const occurrenceService = {
  async getAll(): Promise<Occurrence[]> {
    const response = await fetch(`${API_URL}/occurrences`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch occurrences");
    }
    return response.json();
  },

  async create(data: CreateOccurrenceData): Promise<Occurrence> {
    const response = await fetch(`${API_URL}/occurrences`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create occurrence");
    }
    return response.json();
  },
};
