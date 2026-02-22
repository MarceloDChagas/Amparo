import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DistanceType } from "@/core/domain/enums/distance-type.enum";

export const startCheckInSchema = z.object({
  distanceType: z.nativeEnum(DistanceType),
});

export class StartCheckInDto extends createZodDto(startCheckInSchema) {}
