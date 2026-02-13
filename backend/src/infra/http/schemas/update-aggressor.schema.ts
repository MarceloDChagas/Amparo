import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateAggressorSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  cpf: z.string().length(11, "CPF must be 11 characters").optional(),
  // Add other fields as necessary from the entity
});

export class UpdateAggressorDto extends createZodDto(UpdateAggressorSchema) {}
