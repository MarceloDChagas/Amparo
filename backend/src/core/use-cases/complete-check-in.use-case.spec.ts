import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  CheckInStatus,
  DistanceType,
} from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import {
  CheckInRecord,
  CheckInRepository,
} from "@/core/domain/repositories/check-in-repository";
import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { ActiveCheckInNotFoundError } from "@/core/errors/check-in.errors";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";

import { CompleteCheckInUseCase } from "./complete-check-in.use-case";

describe("CompleteCheckInUseCase", () => {
  let useCase: CompleteCheckInUseCase;
  let checkInRepositoryMock: jest.Mocked<CheckInRepository>;
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
    checkInRepositoryMock = {
      findActiveByUserId: jest.fn(),
      findAllActive: jest.fn(),
      findById: jest.fn(),
      findDetailedById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      complete: jest.fn(),
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
      checkInRepositoryMock,
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
    } as CheckInRecord;
    checkInRepositoryMock.findActiveByUserId.mockResolvedValue(activeCheckIn);
    checkInValidationServiceMock.validateCheckIn.mockReturnValue(
      CheckInStatus.ON_TIME,
    );
    checkInRepositoryMock.complete.mockResolvedValue({
      ...activeCheckIn,
      status: CheckInStatus.ON_TIME,
    } as CheckInRecord);

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
    expect(checkInRepositoryMock.complete.mock.calls).toHaveLength(1);
    expect(checkInRepositoryMock.complete.mock.calls[0]).toEqual([
      "checkIn123",
      expect.objectContaining({
        finalLatitude: -23.5,
        finalLongitude: -46.6,
        status: CheckInStatus.ON_TIME,
      }),
    ]);

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
    } as CheckInRecord;
    checkInRepositoryMock.findActiveByUserId.mockResolvedValue(activeCheckIn);
    checkInValidationServiceMock.validateCheckIn.mockReturnValue(
      CheckInStatus.LATE,
    );
    checkInRepositoryMock.complete.mockResolvedValue({
      ...activeCheckIn,
      status: CheckInStatus.LATE,
    } as CheckInRecord);

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

  it("should throw ActiveCheckInNotFoundError if no active check-in is found", async () => {
    checkInRepositoryMock.findActiveByUserId.mockResolvedValue(null);

    const request = {
      userId: "user-1",
    };

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      ActiveCheckInNotFoundError,
    );
    await expect(useCase.execute(request)).rejects.toThrow(
      "No active check-in found for this user",
    );

    expect(checkInRepositoryMock.complete.mock.calls).toHaveLength(0);
    expect(createEmergencyAlertMock.execute).not.toHaveBeenCalled();
  });
});
