import { apiClient } from "./api-client";

export interface CreateAggressorData {
  name: string;
  cpf: string;
}

export const aggressorService = {
  create: async (data: CreateAggressorData) => {
    return apiClient("/aggressors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
