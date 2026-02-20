import { createZodDto } from "nestjs-zod";

import { CreateEmergencyContactSchema } from "./create-emergency-contact.schema";

export const UpdateEmergencyContactSchema =
  CreateEmergencyContactSchema.partial().omit({ userId: true });

export class UpdateEmergencyContactDto extends createZodDto(
  UpdateEmergencyContactSchema,
) {}
