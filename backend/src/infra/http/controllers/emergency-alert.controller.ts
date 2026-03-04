import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetAllEmergencyAlertsUseCase } from "@/core/use-cases/get-all-emergency-alerts.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

import { CreateEmergencyAlertDto } from "../schemas/create-emergency-alert.schema";

@Controller("emergency-alerts")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class EmergencyAlertController {
  constructor(
    private createEmergencyAlert: CreateEmergencyAlert,
    private getActiveEmergencyAlert: GetActiveEmergencyAlertUseCase,
    private getAllEmergencyAlerts: GetAllEmergencyAlertsUseCase,
    private getEmergencyAlertById: GetEmergencyAlertByIdUseCase,
    private getAlertHistory: GetAlertHistoryUseCase,
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
    return this.getEmergencyAlertById.execute(id);
  }

  @Get(":id/events")
  @Roles(Role.ADMIN)
  async getEvents(@Param("id") id: string) {
    return this.getAlertHistory.execute({ alertId: id });
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
