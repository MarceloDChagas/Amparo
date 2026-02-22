import { apiClient } from "./api-client";

export interface CreateUserData {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: string;
}

export const userService = {
  create: async (data: CreateUserData) => {
    return apiClient("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (): Promise<User[]> => {
    return apiClient("/users");
  },
};
