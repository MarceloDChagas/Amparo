import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateEmergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone must have at least 10 digits"),
  email: z.string().email("Invalid email").optional(),
  relationship: z.string().min(1, "Relationship is required"),
  priority: z.number().int().min(1).default(1),
  victimId: z.string().uuid("Invalid victim ID"),
});

export class CreateEmergencyContactDto extends createZodDto(
  CreateEmergencyContactSchema,
) {}
