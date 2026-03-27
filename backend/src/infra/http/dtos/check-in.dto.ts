import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DistanceType } from "@/core/domain/enums/distance-type.enum";

export const startCheckInSchema = z.object({
  distanceType: z.nativeEnum(DistanceType),
  startLatitude: z.number().optional(),
  startLongitude: z.number().optional(),
});

export class StartCheckInDto extends createZodDto(startCheckInSchema) {}

export const completeCheckInSchema = z.object({
  finalLatitude: z.number().optional(),
  finalLongitude: z.number().optional(),
});

export class CompleteCheckInDto extends createZodDto(completeCheckInSchema) {}

// AM-159 — POST /check-ins/schedule
export const createCheckInScheduleSchema = z.object({
  name: z.string().min(1),
  destinationAddress: z.string().optional(),
  destinationLat: z.number(),
  destinationLng: z.number(),
  expectedArrivalAt: z.string().datetime(),
  windowMinutes: z.number().int().min(1).max(120).optional(),
});

export class CreateCheckInScheduleDto extends createZodDto(
  createCheckInScheduleSchema,
) {}
