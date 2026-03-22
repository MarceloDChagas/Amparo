import { apiClient } from "./api-client";

export interface CreateEmergencyContactData {
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  userId: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const emergencyContactService = {
  create: async (data: CreateEmergencyContactData) => {
    return apiClient("/emergency-contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (): Promise<EmergencyContact[]> => {
    return apiClient("/emergency-contacts");
  },

  getByUserId: async (userId: string): Promise<EmergencyContact[]> => {
    return apiClient(`/emergency-contacts/user/${userId}`);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient(`/emergency-contacts/${id}`, { method: "DELETE" });
  },
};
