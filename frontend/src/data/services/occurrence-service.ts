import { apiClient } from "./api-client";

export interface CreateOccurrenceData {
  description: string;
  latitude: number;
  longitude: number;
  victimId: string;
  aggressorId: string;
}

export const occurrenceService = {
  create: async (data: CreateOccurrenceData) => {
    return apiClient("/occurrences", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
