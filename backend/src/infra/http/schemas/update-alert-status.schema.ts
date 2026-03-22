import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateAlertStatusSchema = z
  .object({
    status: z.enum(["DISPATCHED", "COMPLETED", "CANCELLED"]),
    cancellationReason: z.string().min(5).optional(),
  })
  .refine((data) => data.status !== "CANCELLED" || !!data.cancellationReason, {
    message: "Motivo do cancelamento é obrigatório.",
    path: ["cancellationReason"],
  });

export class UpdateAlertStatusDto extends createZodDto(
  UpdateAlertStatusSchema,
) {}
