import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// AM-159 equivalente — POST /patrol-routes/generate
export const generatePatrolRouteSchema = z.object({
  name: z.string().min(1),
  assignedTo: z.string().uuid().optional(),
  scheduledAt: z.string().datetime().optional(),
  maxWaypoints: z.number().int().min(3).max(30).optional(),
  /** AM-82 — localização atual da viatura (ponto de partida da rota) */
  vehicleLatitude: z.number().optional(),
  vehicleLongitude: z.number().optional(),
});

export class GeneratePatrolRouteDto extends createZodDto(
  generatePatrolRouteSchema,
) {}

// PATCH /patrol-routes/:id/status
export const updatePatrolRouteStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export class UpdatePatrolRouteStatusDto extends createZodDto(
  updatePatrolRouteStatusSchema,
) {}

// PATCH /patrol-routes/:id/assign
export const assignPatrolRouteSchema = z.object({
  agentId: z.string().uuid(),
});

export class AssignPatrolRouteDto extends createZodDto(
  assignPatrolRouteSchema,
) {}
