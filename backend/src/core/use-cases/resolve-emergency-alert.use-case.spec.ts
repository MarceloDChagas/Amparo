import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import { EmergencyAlertNotFoundError } from "@/core/errors/emergency-alert.errors";

import { ResolveEmergencyAlertUseCase } from "./resolve-emergency-alert.use-case";

describe("ResolveEmergencyAlertUseCase", () => {
  const alertRepositoryMock = {
    create: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
  };

  const recordAlertEventMock = {
    execute: jest.fn(),
  };

  let useCase: ResolveEmergencyAlertUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ResolveEmergencyAlertUseCase(
      alertRepositoryMock,
      recordAlertEventMock as never,
    );
  });

  it("should throw EmergencyAlertNotFoundError when alert does not exist", async () => {
    alertRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ alertId: "alert-missing", resolvedBy: "admin" }),
    ).rejects.toThrow(EmergencyAlertNotFoundError);

    expect(alertRepositoryMock.updateStatus).not.toHaveBeenCalled();
    expect(recordAlertEventMock.execute).not.toHaveBeenCalled();
  });

  it("should complete alert and return updated entity", async () => {
    const existing = EmergencyAlert.create(
      { latitude: -23.55, longitude: -46.63, userId: "user-1" },
      "alert-1",
      new Date("2026-01-01T10:00:00.000Z"),
      AlertStatus.DISPATCHED,
    );
    alertRepositoryMock.findById.mockResolvedValue(existing);

    const result = await useCase.execute({
      alertId: "alert-1",
      resolvedBy: "Operador A",
    });

    expect(alertRepositoryMock.updateStatus).toHaveBeenCalledWith(
      "alert-1",
      AlertStatus.COMPLETED,
    );
    expect(result.status).toBe(AlertStatus.COMPLETED);
    expect(result.id).toBe("alert-1");

    expect(recordAlertEventMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        alertId: "alert-1",
        type: "STATUS_CHANGE",
        source: "ADMIN",
        message: "Alerta encerrado por Operador A.",
      }),
    );
  });
});
