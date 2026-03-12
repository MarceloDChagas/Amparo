export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  cpf?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenOutput {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
