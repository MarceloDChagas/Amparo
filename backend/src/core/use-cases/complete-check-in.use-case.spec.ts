import { NotFoundException } from "@nestjs/common";

import {
  CheckInStatus,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { PrismaService } from "@/infra/database/prisma.service";

import { CompleteCheckInUseCase } from "./complete-check-in.use-case";

describe("CompleteCheckInUseCase", () => {
  let useCase: CompleteCheckInUseCase;
  let prismaMock: {
    checkIn: {
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };
  let checkInValidationServiceMock: {
    validateCheckIn: jest.Mock;
  };
  let auditLoggerMock: {
    log: jest.Mock;
  };
  let createEmergencyAlertMock: {
    execute: jest.Mock;
  };

  beforeEach(() => {
    prismaMock = {
      checkIn: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    checkInValidationServiceMock = {
      validateCheckIn: jest.fn(),
    };

    auditLoggerMock = {
      log: jest.fn(),
    };

    createEmergencyAlertMock = {
      execute: jest.fn(),
    };

    useCase = new CompleteCheckInUseCase(
      prismaMock as unknown as PrismaService,
      checkInValidationServiceMock as unknown as CheckInValidationService,
      auditLoggerMock as unknown as AuditLoggerPort,
      createEmergencyAlertMock as unknown as CreateEmergencyAlert,
    );
  });

  it("should complete check-in ON_TIME successfully without triggering alert", async () => {
    // Arrange
    const activeCheckIn = {
      id: "checkIn123",
      userId: "user-1",
      distanceType: DistanceType.SHORT,
      expectedArrivalTime: new Date(),
    };
    prismaMock.checkIn.findFirst.mockResolvedValue(activeCheckIn);
    checkInValidationServiceMock.validateCheckIn.mockReturnValue(
      CheckInStatus.ON_TIME,
    );
    prismaMock.checkIn.update.mockResolvedValue({
      ...activeCheckIn,
      status: CheckInStatus.ON_TIME,
    });

    const request = {
      userId: "user-1",
      finalLatitude: -23.5,
      finalLongitude: -46.6,
    };

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result).toBeDefined();
    expect(result.status).toBe(CheckInStatus.ON_TIME);

    // Ensure the record is updated with final positions
    expect(prismaMock.checkIn.update).toHaveBeenCalledWith({
      where: { id: "checkIn123" },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.objectContaining({
        finalLatitude: -23.5,
        finalLongitude: -46.6,
        status: CheckInStatus.ON_TIME,
      }),
    });

    // Ensure Emergency alert was NOT triggered
    expect(createEmergencyAlertMock.execute).not.toHaveBeenCalled();
    expect(auditLoggerMock.log).toHaveBeenCalled();
  });

  it("should complete check-in LATE and trigger EmergencyAlert", async () => {
    // Arrange
    const activeCheckIn = {
      id: "checkIn123",
      userId: "user-1",
      distanceType: DistanceType.SHORT,
      startLatitude: -23.1,
      startLongitude: -46.1,
      expectedArrivalTime: new Date(),
    };
    prismaMock.checkIn.findFirst.mockResolvedValue(activeCheckIn);
    checkInValidationServiceMock.validateCheckIn.mockReturnValue(
      CheckInStatus.LATE,
    );
    prismaMock.checkIn.update.mockResolvedValue({
      ...activeCheckIn,
      status: CheckInStatus.LATE,
    });

    const request = {
      userId: "user-1",
    };

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.status).toBe(CheckInStatus.LATE);

    // Ensure Emergency alert WAS triggered using start coordinates (since final weren't provided)
    expect(createEmergencyAlertMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        latitude: -23.1,
        longitude: -46.1,
      }),
    );
  });

  it("should throw NotFoundException if no active check-in is found", async () => {
    prismaMock.checkIn.findFirst.mockResolvedValue(null);

    const request = {
      userId: "user-1",
    };

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(request)).rejects.toThrow(
      "No active check-in found for this user",
    );

    expect(prismaMock.checkIn.update).not.toHaveBeenCalled();
    expect(createEmergencyAlertMock.execute).not.toHaveBeenCalled();
  });
});
