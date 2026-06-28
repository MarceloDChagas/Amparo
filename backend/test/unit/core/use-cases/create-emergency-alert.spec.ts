import { AlertStatus } from "@/core/domain/enums/alert-status.enum";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";

// Valida a criação de um alerta de emergência (com usuário e anônimo) e seus efeitos.
describe("CreateEmergencyAlert", () => {
  const emergencyAlertRepositoryMock = {
    create: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
  };

  const notificationPortMock = {
    notify: jest.fn(),
  };

  const recordAlertEventMock = {
    execute: jest.fn(),
  };

  let useCase: CreateEmergencyAlert;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateEmergencyAlert(
      emergencyAlertRepositoryMock,
      notificationPortMock,
      recordAlertEventMock as unknown as RecordAlertEventUseCase,
    );
  });

  // Garante que alerta de usuário é persistido (status PENDING), registra evento CREATED e notifica.
  it("should create and notify a user-originated emergency alert", async () => {
    await useCase.execute({
      latitude: -23.5505,
      longitude: -46.6333,
      address: "Av. Paulista, 1000",
      userId: "user-123",
    });

    expect(emergencyAlertRepositoryMock.create).toHaveBeenCalledTimes(1);
    const [[createdAlert]] = emergencyAlertRepositoryMock.create.mock.calls as [
      [
        {
          id: string;
          latitude: number;
          longitude: number;
          address: string;
          userId: string;
          status: AlertStatus;
        },
      ],
    ];

    expect(createdAlert).toEqual(
      expect.objectContaining({
        latitude: -23.5505,
        longitude: -46.6333,
        address: "Av. Paulista, 1000",
        userId: "user-123",
        status: AlertStatus.PENDING,
      }),
    );

    expect(recordAlertEventMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        alertId: createdAlert.id,
        type: "CREATED",
        source: "USER",
        message: "Chamado originado pelo usuário",
      }),
    );

    expect(notificationPortMock.notify).toHaveBeenCalledWith(createdAlert);
  });

  // Garante que sem userId o evento marca origem anônima e guarda os dados de local no metadata.
  it("should register anonymous origin metadata when userId is not provided", async () => {
    await useCase.execute({
      latitude: -10,
      longitude: -20,
      address: "Local desconhecido",
    });

    expect(recordAlertEventMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Chamado originado anonimamente",
      }),
    );

    const [[eventPayload]] = recordAlertEventMock.execute.mock.calls as [
      [{ metadata: string }],
    ];
    const metadata = eventPayload.metadata;
    expect(JSON.parse(metadata)).toEqual(
      expect.objectContaining({
        latitude: -10,
        longitude: -20,
        address: "Local desconhecido",
      }),
    );
  });
});
