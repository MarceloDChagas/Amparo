import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateVictimSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cpf: z.string().length(11, "CPF must be 11 characters"),
});

export class CreateVictimDto extends createZodDto(CreateVictimSchema) {}
