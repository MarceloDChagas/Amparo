import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const registerUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().length(11, "CPF must be 11 characters").optional(),
});

export class RegisterUserDto extends createZodDto(registerUserSchema) {}
