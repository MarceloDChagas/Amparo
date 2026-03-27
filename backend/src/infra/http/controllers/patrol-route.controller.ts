import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import { AssignPatrolRouteUseCase } from "@/core/use-cases/patrol-route/assign-patrol-route.use-case";
import { GeneratePatrolRouteUseCase } from "@/core/use-cases/patrol-route/generate-patrol-route.use-case";
import { PatrolRouteNotFoundError } from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";
import { GetPatrolRouteByIdUseCase } from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";
import { GetPatrolRoutesUseCase } from "@/core/use-cases/patrol-route/get-patrol-routes.use-case";
import { UpdatePatrolRouteStatusUseCase } from "@/core/use-cases/patrol-route/update-patrol-route-status.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import {
  AssignPatrolRouteDto,
  GeneratePatrolRouteDto,
  UpdatePatrolRouteStatusDto,
} from "@/infra/http/dtos/patrol-route.dto";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

@ApiTags("Patrol Routes")
@Controller("patrol-routes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(Role.ADMIN)
export class PatrolRouteController {
  constructor(
    private readonly generatePatrolRouteUseCase: GeneratePatrolRouteUseCase,
    private readonly getPatrolRoutesUseCase: GetPatrolRoutesUseCase,
    private readonly getPatrolRouteByIdUseCase: GetPatrolRouteByIdUseCase,
    private readonly updatePatrolRouteStatusUseCase: UpdatePatrolRouteStatusUseCase,
    private readonly assignPatrolRouteUseCase: AssignPatrolRouteUseCase,
  ) {}

  /**
   * AM-83 + AM-85 — Gera rota de patrulha baseada no mapa de calor.
   * AM-82 — Aceita posição da viatura como ponto de partida opcional.
   * AM-84 — Registra log de geração.
   */
  @Post("generate")
  @ApiOperation({
    summary: "Generate patrol route based on heat map density (Admin only)",
  })
  @UsePipes(ZodValidationPipe)
  async generate(@Request() req, @Body() body: GeneratePatrolRouteDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const adminId = (req.user as { id: string }).id;
    try {
      return await this.generatePatrolRouteUseCase.execute({
        name: body.name,
        generatedBy: adminId,
        assignedTo: body.assignedTo,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
        maxWaypoints: body.maxWaypoints,
        vehicleLatitude: body.vehicleLatitude,
        vehicleLongitude: body.vehicleLongitude,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("mapa de calor")) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get()
  @ApiOperation({ summary: "List all patrol routes (Admin only)" })
  async findAll() {
    return this.getPatrolRoutesUseCase.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get patrol route by ID with logs (Admin only)" })
  async findById(@Param("id") id: string) {
    try {
      return await this.getPatrolRouteByIdUseCase.execute(id);
    } catch (err) {
      if (err instanceof PatrolRouteNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  /**
   * AM-82 + AM-84 — Atualiza status da rota (IN_PROGRESS / COMPLETED / CANCELLED)
   * e registra log automaticamente.
   */
  @Patch(":id/status")
  @ApiOperation({ summary: "Update patrol route status (Admin only)" })
  @UsePipes(ZodValidationPipe)
  async updateStatus(
    @Request() req,
    @Param("id") id: string,
    @Body() body: UpdatePatrolRouteStatusDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const adminId = (req.user as { id: string }).id;
    try {
      return await this.updatePatrolRouteStatusUseCase.execute({
        id,
        status: body.status,
        performedBy: adminId,
      });
    } catch (err) {
      if (err instanceof PatrolRouteNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  /** AM-82 — Atribui rota a uma viatura/agente e registra log */
  @Patch(":id/assign")
  @ApiOperation({
    summary: "Assign patrol route to agent/vehicle (Admin only)",
  })
  @UsePipes(ZodValidationPipe)
  async assign(
    @Request() req,
    @Param("id") id: string,
    @Body() body: AssignPatrolRouteDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const adminId = (req.user as { id: string }).id;
    try {
      return await this.assignPatrolRouteUseCase.execute({
        id,
        agentId: body.agentId,
        performedBy: adminId,
      });
    } catch (err) {
      if (err instanceof PatrolRouteNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
