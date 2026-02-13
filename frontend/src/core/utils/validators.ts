import { cpf } from "cpf-cnpj-validator";

export const isValidCPF = (value: string) => {
  return cpf.isValid(value);
};
