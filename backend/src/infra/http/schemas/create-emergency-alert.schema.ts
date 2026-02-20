import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateEmergencyAlertSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  userId: z.string().uuid().optional(),
});

export class CreateEmergencyAlertDto extends createZodDto(
  CreateEmergencyAlertSchema,
) {}
