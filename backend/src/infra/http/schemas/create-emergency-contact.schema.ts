import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateEmergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^\d{10,}$/, "Phone must contain at least 10 digits (numbers only)"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  relationship: z.string().min(1, "Relationship is required"),
  priority: z.number().int().min(1).default(1),
  userId: z.string().uuid("Invalid user ID"),
});

export class CreateEmergencyContactDto extends createZodDto(
  CreateEmergencyContactSchema,
) {}
