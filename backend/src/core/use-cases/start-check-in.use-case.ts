import { Injectable } from "@nestjs/common";

import {
  DistanceTolerances,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { PrismaService } from "@/infra/database/prisma.service";

interface StartCheckInRequest {
  userId: string;
  distanceType: DistanceType;
}

@Injectable()
export class StartCheckInUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(request: StartCheckInRequest) {
    const { userId, distanceType } = request;

    // Check if user already has an ACTIVE check-in
    const existingCheckIn = await this.prisma.checkIn.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (existingCheckIn) {
      throw new Error("User already has an active check-in");
    }

    // eslint-disable-next-line security/detect-object-injection
    const toleranceMinutes = DistanceTolerances[distanceType];
    const now = new Date();
    // expected arrival time is the travel time (assuming tolerance is the travel time estimation, or we could add another calculation, but sticking to tolerance as baseline + actual tolerance logic)
    // Actually, for check-in we should define expected time. Since they just pick distance, let's say Expected Arrival Time = Now + Distance Tolerance (max travel time expected)
    const expectedArrivalTime = new Date(
      now.getTime() + toleranceMinutes * 60 * 1000,
    );

    const checkIn = await this.prisma.checkIn.create({
      data: {
        userId,
        distanceType,
        startTime: now,
        expectedArrivalTime,
        status: "ACTIVE",
      },
    });

    return checkIn;
  }
}
