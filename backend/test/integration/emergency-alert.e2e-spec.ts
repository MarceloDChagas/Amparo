/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AlertEvent } from "@/core/domain/entities/alert-event";
import { EMERGENCY_ALERT_NOTIFICATION_PORT } from "@/core/ports/emergency-alert-notification.ports";
import { AlertEventRepository } from "@/core/repositories/alert-event-repository";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetAllEmergencyAlertsUseCase } from "@/core/use-cases/get-all-emergency-alerts.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";
import { UpdateAlertStatusUseCase } from "@/core/use-cases/update-alert-status.use-case";
import { EmergencyAlertController } from "@/infra/http/controllers/emergency-alert.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

// Valida o fluxo HTTP de alertas com use cases reais: criação, registro de eventos e histórico.
describe("EmergencyAlertController (e2e) + Event History", () => {
  let app: INestApplication;

  const mockEmergencyAlertRepository = {
    create: jest.fn(),
    findActive: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockAlertEventRepository = {
    save: jest.fn(),
    findByAlertId: jest.fn(),
  };

  const mockEmergencyAlertNotificationPort = {
    notify: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyAlertController],
      providers: [
        {
          provide: EmergencyAlertRepository,
          useValue: mockEmergencyAlertRepository,
        },
        {
          provide: AlertEventRepository,
          useValue: mockAlertEventRepository,
        },
        {
          provide: EMERGENCY_ALERT_NOTIFICATION_PORT,
          useValue: mockEmergencyAlertNotificationPort,
        },
        RecordAlertEventUseCase,
        CreateEmergencyAlert,
        GetActiveEmergencyAlertUseCase,
        GetAllEmergencyAlertsUseCase,
        GetEmergencyAlertByIdUseCase,
        GetAlertHistoryUseCase,
        UpdateAlertStatusUseCase,
      ],
    })
      .overrideGuard(AuthGuard("jwt"))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // Garante que GET de eventos retorna o histórico do alerta.
  it("Scenario 1: Get events history successfully", async () => {
    const mockEvents = [
      {
        id: "event-1",
        alertId: "alert-1",
        type: "CREATED",
        source: "USER",
        message: "Chamado originado pelo usuário",
        metadata: "{}",
        createdAt: new Date(),
      },
    ];

    mockAlertEventRepository.findByAlertId.mockResolvedValue(mockEvents);

    const res = await request(app.getHttpServer() as unknown as any)
      .get("/emergency-alerts/alert-1/events")
      .expect(200);

    const bodyRes = res.body as AlertEvent[];
    expect(bodyRes).toHaveLength(1);
    expect(bodyRes[0]?.type).toBe("CREATED");
    expect(mockAlertEventRepository.findByAlertId).toHaveBeenCalledWith(
      "alert-1",
    );
  });

  // Garante que criar alerta de usuário registra um evento CREATED com a mensagem correta.
  it("Scenario 2: Creating alert records CREATED event", async () => {
    mockEmergencyAlertRepository.create.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post("/emergency-alerts")
      .send({
        latitude: -23.5505,
        longitude: -46.6333,
        userId: "123e4567-e89b-12d3-a456-426614174000",
      })
      .expect(201);

    expect(mockAlertEventRepository.save).toHaveBeenCalledTimes(1);

    const mockSave = mockAlertEventRepository.save;
    const savedEvent = (mockSave.mock.calls[0] as [AlertEvent])[0];
    expect(savedEvent?.alertId).toBeDefined();
    expect(savedEvent?.type).toBe("CREATED");
    expect(savedEvent?.message).toBe("Chamado originado pelo usuário");
  });

  // Garante que criar alerta anônimo registra evento CREATED com mensagem de origem anônima.
  it("Scenario 3: Creating anonymous alert records CREATED event", async () => {
    mockEmergencyAlertRepository.create.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post("/emergency-alerts")
      .send({
        latitude: -23.5505,
        longitude: -46.6333,
      })
      .expect(201);

    expect(mockAlertEventRepository.save).toHaveBeenCalledTimes(1);

    const mockSave = mockAlertEventRepository.save;
    const savedEvent = (mockSave.mock.calls[0] as [AlertEvent])[0];
    expect(savedEvent?.type).toBe("CREATED");
    expect(savedEvent?.message).toBe("Chamado originado anonimamente");
  });

  // Garante que ao criar alerta os contatos são notificados (porta de notificação chamada).
  it("Scenario 4: Notifying contacts records NOTIFICATION_SENT event", async () => {
    mockEmergencyAlertRepository.create.mockResolvedValue(undefined);
    mockEmergencyAlertNotificationPort.notify.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post("/emergency-alerts")
      .send({
        latitude: -23.5505,
        longitude: -46.6333,
        userId: "123e4567-e89b-12d3-a456-426614174000",
      })
      .expect(201);

    expect(mockEmergencyAlertNotificationPort.notify).toHaveBeenCalledTimes(1);
  });
});
