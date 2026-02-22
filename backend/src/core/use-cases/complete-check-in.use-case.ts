import { Injectable, NotFoundException } from "@nestjs/common";

import { DistanceType } from "@/core/domain/enums/distance-type.enum";
import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { PrismaService } from "@/infra/database/prisma.service";

interface CompleteCheckInRequest {
  userId: string;
}

@Injectable()
export class CompleteCheckInUseCase {
  constructor(
    private prisma: PrismaService,
    private checkInValidationService: CheckInValidationService,
  ) {}

  async execute(request: CompleteCheckInRequest) {
    const { userId } = request;

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
        status: resultStatus,
      },
    });

    return updatedCheckIn;
  }
}
