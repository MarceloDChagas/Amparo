import { EmergencyAlert } from "@/core/domain/entities/emergency-alert";
import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import {
  CancellationReasonRequiredError,
  EmergencyAlertNotFoundError,
  InvalidAlertStatusTransitionError,
} from "@/core/errors/emergency-alert.errors";

import { UpdateAlertStatusUseCase } from "./update-alert-status.use-case";

describe("UpdateAlertStatusUseCase", () => {
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

  let useCase: UpdateAlertStatusUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateAlertStatusUseCase(
      alertRepositoryMock,
      recordAlertEventMock as never,
    );
  });

  it("should update from PENDING to DISPATCHED and register event", async () => {
    alertRepositoryMock.findById.mockResolvedValue(
      EmergencyAlert.create(
        { latitude: -23.55, longitude: -46.63, userId: "user-1" },
        "alert-1",
        new Date("2026-01-01T12:00:00.000Z"),
        AlertStatus.PENDING,
      ),
    );

    await useCase.execute({
      alertId: "alert-1",
      status: AlertStatus.DISPATCHED,
    });

    expect(alertRepositoryMock.updateStatus).toHaveBeenCalledWith(
      "alert-1",
      AlertStatus.DISPATCHED,
      null,
    );

    const [[eventPayload]] = recordAlertEventMock.execute.mock.calls as [
      [{ message: string; metadata: string }],
    ];
    expect(eventPayload.message).toContain("Recebido");
    expect(eventPayload.message).toContain("Viatura Despachada");
    expect(JSON.parse(eventPayload.metadata)).toEqual({
      previousStatus: AlertStatus.PENDING,
      newStatus: AlertStatus.DISPATCHED,
    });
  });

  it("should throw EmergencyAlertNotFoundError when alert does not exist", async () => {
    alertRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        alertId: "missing-alert",
        status: AlertStatus.DISPATCHED,
      }),
    ).rejects.toThrow(EmergencyAlertNotFoundError);

    expect(alertRepositoryMock.updateStatus).not.toHaveBeenCalled();
    expect(recordAlertEventMock.execute).not.toHaveBeenCalled();
  });

  it("should reject invalid transitions", async () => {
    alertRepositoryMock.findById.mockResolvedValue(
      EmergencyAlert.create(
        { latitude: -23.55, longitude: -46.63 },
        "alert-2",
        new Date("2026-01-01T12:00:00.000Z"),
        AlertStatus.COMPLETED,
      ),
    );

    await expect(
      useCase.execute({
        alertId: "alert-2",
        status: AlertStatus.DISPATCHED,
      }),
    ).rejects.toThrow(InvalidAlertStatusTransitionError);

    expect(alertRepositoryMock.updateStatus).not.toHaveBeenCalled();
    expect(recordAlertEventMock.execute).not.toHaveBeenCalled();
  });

  it("should require cancellation reason when moving to CANCELLED", async () => {
    alertRepositoryMock.findById.mockResolvedValue(
      EmergencyAlert.create(
        { latitude: -23.55, longitude: -46.63 },
        "alert-3",
        new Date("2026-01-01T12:00:00.000Z"),
        AlertStatus.PENDING,
      ),
    );

    await expect(
      useCase.execute({
        alertId: "alert-3",
        status: AlertStatus.CANCELLED,
      }),
    ).rejects.toThrow(CancellationReasonRequiredError);

    expect(alertRepositoryMock.updateStatus).not.toHaveBeenCalled();
  });

  it("should persist cancellation reason in update and event metadata", async () => {
    alertRepositoryMock.findById.mockResolvedValue(
      EmergencyAlert.create(
        { latitude: -23.55, longitude: -46.63 },
        "alert-4",
        new Date("2026-01-01T12:00:00.000Z"),
        AlertStatus.PENDING,
      ),
    );

    await useCase.execute({
      alertId: "alert-4",
      status: AlertStatus.CANCELLED,
      cancellationReason: "Falso positivo",
    });

    expect(alertRepositoryMock.updateStatus).toHaveBeenCalledWith(
      "alert-4",
      AlertStatus.CANCELLED,
      "Falso positivo",
    );

    const [[cancellationEventPayload]] = recordAlertEventMock.execute.mock
      .calls as [[{ metadata: string }]];
    const metadata = JSON.parse(cancellationEventPayload.metadata) as {
      previousStatus: AlertStatus;
      newStatus: AlertStatus;
      cancellationReason: string;
    };
    expect(metadata).toEqual({
      previousStatus: AlertStatus.PENDING,
      newStatus: AlertStatus.CANCELLED,
      cancellationReason: "Falso positivo",
    });
  });
});
