import { BadRequestException } from "@nestjs/common";

import { DistanceType } from "@/core/domain/enums/distance-type.enum";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { PrismaService } from "@/infra/database/prisma.service";

import { StartCheckInUseCase } from "./start-check-in.use-case";

describe("StartCheckInUseCase", () => {
  let useCase: StartCheckInUseCase;
  let prismaMock: {
    checkIn: {
      findFirst: jest.Mock;
      create: jest.Mock;
    };
  };
  let auditLoggerMock: {
    log: jest.Mock;
  };

  beforeEach(() => {
    prismaMock = {
      checkIn: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    auditLoggerMock = {
      log: jest.fn(),
    };

    useCase = new StartCheckInUseCase(
      prismaMock as unknown as PrismaService,
      auditLoggerMock as unknown as AuditLoggerPort,
    );
  });

  it("should start a check-in successfully with coordinates", async () => {
    prismaMock.checkIn.findFirst.mockResolvedValue(null);
    prismaMock.checkIn.create.mockResolvedValue({ id: "checkIn123" });

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
    expect(prismaMock.checkIn.create).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          userId: "user-1",
          distanceType: DistanceType.SHORT,
          startLatitude: -23.5505,
          startLongitude: -46.6333,
          status: "ACTIVE",
        }),
      }),
    );

    // Verify audit log was created
    expect(auditLoggerMock.log).toHaveBeenCalled();
  });

  it("should throw BadRequestException if user already has an ACTIVE check-in", async () => {
    prismaMock.checkIn.findFirst.mockResolvedValue({ id: "existing-checkin" });

    const request = {
      userId: "user-1",
      distanceType: DistanceType.SHORT,
    };

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
    await expect(useCase.execute(request)).rejects.toThrow(
      "User already has an active check-in",
    );

    expect(prismaMock.checkIn.create).not.toHaveBeenCalled();
    expect(auditLoggerMock.log).not.toHaveBeenCalled();
  });
});
