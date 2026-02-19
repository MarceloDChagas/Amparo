const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export interface Aggressor {
  id: string;
  name: string;
  cpf: string;
  // Add other fields as needed based on backend entity
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const aggressorService = {
  async getAll(): Promise<Aggressor[]> {
    const response = await fetch(`${API_URL}/aggressors`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch aggressors");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/aggressors/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete aggressor");
    }
  },
};
