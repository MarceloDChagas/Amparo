import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { EmergencyContactLimitExceededError } from "@/core/errors/emergency-contact.errors";
import { CreateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/create-emergency-contact.use-case";
import { DeleteEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/delete-emergency-contact.use-case";
import { GetEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/get-emergency-contact.use-case";
import { UpdateEmergencyContactUseCase } from "@/core/use-cases/emergency-contact/update-emergency-contact.use-case";
import { EmergencyContactController } from "@/infra/http/controllers/emergency-contact.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

describe("EmergencyContactController (functional)", () => {
  let app: INestApplication;

  const createEmergencyContactUseCaseMock = {
    execute: jest.fn(),
  };

  const getEmergencyContactUseCaseMock = {
    execute: jest.fn(),
    executeFindAll: jest.fn(),
    executeFindByUserId: jest.fn(),
  };

  const updateEmergencyContactUseCaseMock = {
    execute: jest.fn(),
  };

  const deleteEmergencyContactUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyContactController],
      providers: [
        {
          provide: CreateEmergencyContactUseCase,
          useValue: createEmergencyContactUseCaseMock,
        },
        {
          provide: GetEmergencyContactUseCase,
          useValue: getEmergencyContactUseCaseMock,
        },
        {
          provide: UpdateEmergencyContactUseCase,
          useValue: updateEmergencyContactUseCaseMock,
        },
        {
          provide: DeleteEmergencyContactUseCase,
          useValue: deleteEmergencyContactUseCaseMock,
        },
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

  afterEach(async () => {
    await app.close();
  });

  it("POST /emergency-contacts returns 400 when limit is exceeded", async () => {
    createEmergencyContactUseCaseMock.execute.mockRejectedValue(
      new EmergencyContactLimitExceededError(),
    );

    const response = await request(app.getHttpServer())
      .post("/emergency-contacts")
      .send({
        name: "Contato 4",
        phone: "11987654321",
        relationship: "IRMA",
        priority: 4,
        userId: "123e4567-e89b-12d3-a456-426614174000",
      })
      .expect(400);

    expect(response.body.message).toBe(
      "O limite máximo é de 3 contatos de confiança por usuária.",
    );
  });

  it("GET /emergency-contacts applies phone and email masking", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    getEmergencyContactUseCaseMock.executeFindAll.mockResolvedValue([
      {
        id: "contact-1",
        name: "Maria Silva",
        phone: "11987656789",
        email: "maria@example.com",
        relationship: "MAE",
        priority: 1,
        userId: "user-1",
        createdAt,
        updatedAt,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/emergency-contacts")
      .expect(200);

    expect(response.body).toEqual([
      {
        id: "contact-1",
        name: "Maria Silva",
        phone: "(11) *****-6789",
        email: "mar***@example.com",
        relationship: "MAE",
        priority: 1,
        userId: "user-1",
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    ]);
  });
});
