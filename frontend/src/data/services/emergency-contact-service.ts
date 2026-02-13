import { apiClient } from "./api-client";

export interface CreateEmergencyContactData {
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  victimId: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  victimId: string;
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

  getByVictimId: async (victimId: string): Promise<EmergencyContact[]> => {
    return apiClient(`/emergency-contacts/victim/${victimId}`);
  },
};
