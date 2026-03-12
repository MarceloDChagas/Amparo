import { Inject, Injectable } from "@nestjs/common";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import { CheckInStatus } from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import {
  CheckInRepository,
  CompleteCheckInData,
} from "@/core/domain/repositories/check-in-repository";
import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { ActiveCheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";

interface CompleteCheckInRequest {
  userId: string;
  finalLatitude?: number;
  finalLongitude?: number;
}

@Injectable()
export class CompleteCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY)
    private checkInRepository: CheckInRepository,
    private checkInValidationService: CheckInValidationService,
    private auditLogger: AuditLoggerPort,
    private createEmergencyAlert: CreateEmergencyAlert,
  ) {}

  async execute(request: CompleteCheckInRequest) {
    const { userId, finalLatitude, finalLongitude } = request;

    const checkIn = await this.checkInRepository.findActiveByUserId(userId);

    if (!checkIn) {
      throw new ActiveCheckInNotFoundError();
    }

    const actualArrivalTime = new Date();
    const distanceType = checkIn.distanceType;

    const resultStatus = this.checkInValidationService.validateCheckIn(
      checkIn.expectedArrivalTime,
      actualArrivalTime,
      distanceType,
    );

    const completeData: CompleteCheckInData = {
      actualArrivalTime,
      finalLatitude,
      finalLongitude,
      status: resultStatus,
    };

    const updatedCheckIn = await this.checkInRepository.complete(
      checkIn.id,
      completeData,
    );

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
