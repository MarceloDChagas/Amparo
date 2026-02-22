/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AlertEvent } from "@/core/domain/entities/alert-event";
import { AlertEventRepository } from "@/core/repositories/alert-event-repository";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";
import { EmergencyAlertController } from "@/infra/http/controllers/emergency-alert.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

describe("EmergencyAlertController (e2e) + Event History", () => {
  let app: INestApplication;

  const mockEmergencyAlertRepository = {
    create: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
  };

  const mockAlertEventRepository = {
    save: jest.fn(),
    findByAlertId: jest.fn(),
  };

  const mockEmergencyContactRepository = {
    findByUserId: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
  };

  const mockEmailService = {
    sendEmergencyNotification: jest.fn(),
  };

  const mockNotificationLogRepository = {
    create: jest.fn(),
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
          provide: "IEmergencyContactRepository",
          useValue: mockEmergencyContactRepository,
        },
        { provide: "UserRepository", useValue: mockUserRepository },
        { provide: "IEmailService", useValue: mockEmailService },
        {
          provide: "INotificationLogRepository",
          useValue: mockNotificationLogRepository,
        },
        RecordAlertEventUseCase,
        CreateEmergencyAlert,
        GetActiveEmergencyAlertUseCase,
        GetEmergencyAlertByIdUseCase,
        GetAlertHistoryUseCase,
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
    await app.close();
  });

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

  it("Scenario 2: Creating alert records CREATED event", async () => {
    mockEmergencyContactRepository.findByUserId.mockResolvedValue([]);
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

  it("Scenario 4: Notifying contacts records NOTIFICATION_SENT event", async () => {
    mockEmergencyContactRepository.findByUserId.mockResolvedValue([
      { name: "Mother", email: "mom@example.com" },
    ]);
    mockUserRepository.findById.mockResolvedValue({ name: "Victim 1" });
    mockEmailService.sendEmergencyNotification.mockResolvedValue(undefined);
    mockEmergencyAlertRepository.create.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post("/emergency-alerts")
      .send({
        latitude: -23.5505,
        longitude: -46.6333,
        userId: "123e4567-e89b-12d3-a456-426614174000",
      })
      .expect(201);

    // Save should be called twice: 1 for CREATED, 1 for NOTIFICATION_SENT
    expect(mockAlertEventRepository.save).toHaveBeenCalledTimes(2);

    const mockSave = mockAlertEventRepository.save;
    const secondEvent = (mockSave.mock.calls[1] as [AlertEvent])[0];
    expect(secondEvent?.type).toBe("NOTIFICATION_SENT");
    expect(secondEvent?.message).toContain("Notificação enviada para Mother");
  });
});
