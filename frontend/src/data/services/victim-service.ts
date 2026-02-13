import { apiClient } from "./api-client";

export interface CreateVictimData {
  name: string;
  cpf: string;
}

export interface Victim {
  id: string;
  name: string;
  cpf: string;
  createdAt: string;
}

export const victimService = {
  create: async (data: CreateVictimData) => {
    return apiClient("/victims", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (): Promise<Victim[]> => {
    return apiClient("/victims");
  },
};
