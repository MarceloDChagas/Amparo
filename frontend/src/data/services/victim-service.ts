import { apiClient } from "./api-client";

export interface CreateVictimData {
  name: string;
  cpf: string;
}

export const victimService = {
  create: async (data: CreateVictimData) => {
    return apiClient("/victims", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
