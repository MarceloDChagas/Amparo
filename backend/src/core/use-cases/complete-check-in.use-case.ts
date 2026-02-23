import { Injectable, NotFoundException } from "@nestjs/common";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import {
  CheckInStatus,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { PrismaService } from "@/infra/database/prisma.service";

interface CompleteCheckInRequest {
  userId: string;
  finalLatitude?: number;
  finalLongitude?: number;
}

@Injectable()
export class CompleteCheckInUseCase {
  constructor(
    private prisma: PrismaService,
    private checkInValidationService: CheckInValidationService,
    private auditLogger: AuditLoggerPort,
    private createEmergencyAlert: CreateEmergencyAlert,
  ) {}

  async execute(request: CompleteCheckInRequest) {
    const { userId, finalLatitude, finalLongitude } = request;

    // Find the active check-in for the user
    const checkIn = await this.prisma.checkIn.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!checkIn) {
      throw new NotFoundException("No active check-in found for this user");
    }

    const actualArrivalTime = new Date();
    const distanceType = checkIn.distanceType as DistanceType;

    // Validate the arrival status
    const resultStatus = this.checkInValidationService.validateCheckIn(
      checkIn.expectedArrivalTime,
      actualArrivalTime,
      distanceType,
    );

    // Update the record with actual time and final status
    const updatedCheckIn = await this.prisma.checkIn.update({
      where: { id: checkIn.id },
      data: {
        actualArrivalTime,
        finalLatitude,
        finalLongitude,
        status: resultStatus,
      },
    });

    if (resultStatus === CheckInStatus.LATE) {
      const lat = finalLatitude ?? checkIn.startLatitude ?? 0;
      const lng = finalLongitude ?? checkIn.startLongitude ?? 0;

      await this.createEmergencyAlert.execute({
        userId,
        latitude: lat,
        longitude: lng,
        address: "Última localização reportada no Check-in Atrasado",
      });
    }

    await this.auditLogger.log(
      new AuditLog({
        action: "COMPLETE_CHECK_IN",
        resource: "CheckIn",
        resourceId: updatedCheckIn.id,
        userId: userId,
      }),
    );

    return updatedCheckIn;
  }
}
