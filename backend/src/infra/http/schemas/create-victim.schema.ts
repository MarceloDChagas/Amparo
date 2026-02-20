import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateVictimSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cpf: z.string().length(11, "CPF must be 11 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export class CreateVictimDto extends createZodDto(CreateVictimSchema) {}
