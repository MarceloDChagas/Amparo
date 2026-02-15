import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";

import { CreateEmergencyAlertDto } from "../schemas/create-emergency-alert.schema";

@Controller("emergency-alerts")
export class EmergencyAlertController {
  constructor(private createEmergencyAlert: CreateEmergencyAlert) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() body: CreateEmergencyAlertDto): Promise<void> {
    await this.createEmergencyAlert.execute({
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      victimId: body.victimId,
    });
  }
}
