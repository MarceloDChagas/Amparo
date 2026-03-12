import { DistanceType } from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import {
  CheckInRecord,
  CheckInRepository,
} from "@/core/domain/repositories/check-in-repository";
import { ActiveCheckInAlreadyExistsError } from "@/core/errors/check-in.errors";

import { StartCheckInUseCase } from "./start-check-in.use-case";

describe("StartCheckInUseCase", () => {
  let useCase: StartCheckInUseCase;
  let checkInRepositoryMock: jest.Mocked<CheckInRepository>;
  let auditLoggerMock: {
    log: jest.Mock;
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

    auditLoggerMock = {
      log: jest.fn(),
    };

    useCase = new StartCheckInUseCase(
      checkInRepositoryMock,
      auditLoggerMock as unknown as AuditLoggerPort,
    );
  });

  it("should start a check-in successfully with coordinates", async () => {
    checkInRepositoryMock.findActiveByUserId.mockResolvedValue(null);
    checkInRepositoryMock.create.mockResolvedValue({
      id: "checkIn123",
    } as CheckInRecord);

    const request = {
      userId: "user-1",
      distanceType: DistanceType.SHORT,
      startLatitude: -23.5505,
      startLongitude: -46.6333,
    };

    const result = await useCase.execute(request);

    expect(result).toBeDefined();
    expect(result.id).toBe("checkIn123");

    // Verify creation was called with correct data
    expect(checkInRepositoryMock.create.mock.calls).toHaveLength(1);
    expect(checkInRepositoryMock.create.mock.calls[0]).toEqual([
      expect.objectContaining({
        userId: "user-1",
        distanceType: DistanceType.SHORT,
        startLatitude: -23.5505,
        startLongitude: -46.6333,
        status: "ACTIVE",
      }),
    ]);

    // Verify audit log was created
    expect(auditLoggerMock.log).toHaveBeenCalled();
  });

  it("should throw ActiveCheckInAlreadyExistsError if user already has an ACTIVE check-in", async () => {
    checkInRepositoryMock.findActiveByUserId.mockResolvedValue(
      {} as CheckInRecord,
    );

    const request = {
      userId: "user-1",
      distanceType: DistanceType.SHORT,
    };

    await expect(useCase.execute(request)).rejects.toThrow(
      ActiveCheckInAlreadyExistsError,
    );
    await expect(useCase.execute(request)).rejects.toThrow(
      "User already has an active check-in",
    );

    expect(checkInRepositoryMock.create.mock.calls).toHaveLength(0);
    expect(auditLoggerMock.log).not.toHaveBeenCalled();
  });
});
