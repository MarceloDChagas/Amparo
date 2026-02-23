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
