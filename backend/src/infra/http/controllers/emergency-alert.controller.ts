import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import {
  CancellationReasonRequiredError,
  EmergencyAlertNotFoundError,
  InvalidAlertStatusTransitionError,
} from "@/core/errors/emergency-alert.errors";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetAllEmergencyAlertsUseCase } from "@/core/use-cases/get-all-emergency-alerts.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { UpdateAlertStatusUseCase } from "@/core/use-cases/update-alert-status.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

import { CreateEmergencyAlertDto } from "../schemas/create-emergency-alert.schema";
import { UpdateAlertStatusDto } from "../schemas/update-alert-status.schema";

@Controller("emergency-alerts")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class EmergencyAlertController {
  constructor(
    private createEmergencyAlert: CreateEmergencyAlert,
    private getActiveEmergencyAlert: GetActiveEmergencyAlertUseCase,
    private getAllEmergencyAlerts: GetAllEmergencyAlertsUseCase,
    private getEmergencyAlertById: GetEmergencyAlertByIdUseCase,
    private getAlertHistory: GetAlertHistoryUseCase,
    private updateAlertStatus: UpdateAlertStatusUseCase,
  ) {}

  @Get("active")
  @Roles(Role.ADMIN)
  async getActive() {
    return this.getActiveEmergencyAlert.execute();
  }

  @Get("all")
  @Roles(Role.ADMIN)
  async getAll() {
    return this.getAllEmergencyAlerts.execute();
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  async getById(@Param("id") id: string) {
    try {
      return await this.getEmergencyAlertById.execute(id);
    } catch (error) {
      if (error instanceof EmergencyAlertNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(":id/events")
  @Roles(Role.ADMIN)
  async getEvents(@Param("id") id: string) {
    return this.getAlertHistory.execute({ alertId: id });
  }

  @Patch(":id/status")
  @Roles(Role.ADMIN)
  @UsePipes(ZodValidationPipe)
  async patchStatus(
    @Param("id") id: string,
    @Body() body: UpdateAlertStatusDto,
  ): Promise<void> {
    try {
      await this.updateAlertStatus.execute({
        alertId: id,
        status: body.status,
        cancellationReason: body.cancellationReason,
      });
    } catch (error) {
      if (error instanceof EmergencyAlertNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidAlertStatusTransitionError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof CancellationReasonRequiredError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @Roles(Role.VICTIM)
  @UsePipes(ZodValidationPipe)
  async create(@Body() body: CreateEmergencyAlertDto): Promise<void> {
    await this.createEmergencyAlert.execute({
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      userId: body.userId,
    });
  }
}
