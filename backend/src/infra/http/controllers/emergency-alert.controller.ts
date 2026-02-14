import { Body, Controller, Post } from "@nestjs/common";

import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";

interface CreateEmergencyAlertDto {
  latitude: number;
  longitude: number;
  address?: string;
  victimId?: string;
}

@Controller("emergency-alerts")
export class EmergencyAlertController {
  constructor(private createEmergencyAlert: CreateEmergencyAlert) {}

  @Post()
  async create(@Body() body: CreateEmergencyAlertDto): Promise<void> {
    await this.createEmergencyAlert.execute({
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      victimId: body.victimId,
    });
  }
}
