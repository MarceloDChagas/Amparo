import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateVictimSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  cpf: z.string().length(11, "CPF must be 11 characters").optional(),
});

export class UpdateVictimDto extends createZodDto(UpdateVictimSchema) {}
