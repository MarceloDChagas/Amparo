import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateOccurrenceSchema = z.object({
  description: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  userId: z.string().uuid(),
  aggressorId: z.string().uuid(),
});

export class CreateOccurrenceDto extends createZodDto(CreateOccurrenceSchema) {}
