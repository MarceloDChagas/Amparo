import { apiClient } from "./api-client";

export interface CreateEmergencyAlertRequest {
  latitude: number;
  longitude: number;
  address?: string;
  userId?: string;
}

export const EmergencyAlertService = {
  create: async (data: CreateEmergencyAlertRequest): Promise<void> => {
    return apiClient<void>("/emergency-alerts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
