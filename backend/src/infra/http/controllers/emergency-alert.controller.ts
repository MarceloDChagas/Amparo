import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "nestjs-zod";

import { Role } from "@/core/domain/enums/role.enum";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

import { CreateEmergencyAlertDto } from "../schemas/create-emergency-alert.schema";

@Controller("emergency-alerts")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class EmergencyAlertController {
  constructor(
    private createEmergencyAlert: CreateEmergencyAlert,
    private getActiveEmergencyAlert: GetActiveEmergencyAlertUseCase,
  ) {}

  @Get("active")
  @Roles(Role.ADMIN)
  async getActive() {
    return this.getActiveEmergencyAlert.execute();
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
