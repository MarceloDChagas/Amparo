import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { PrismaService } from "@/infra/database/prisma.service";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { VictimModule } from "@/infra/modules/victim.module";

describe("VictimController (e2e)", () => {
  let app: INestApplication;

  const mockPrismaService = {
    onModuleInit: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  const mockVictimRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [VictimModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider("IVictimRepository")
      .useValue(mockVictimRepository)
      .overrideGuard(AuthGuard("jwt"))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/victims (GET)", async () => {
    mockVictimRepository.findAll.mockResolvedValue([]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer()).get("/victims").expect(200).expect([]);
  });

  it("/victims (POST)", async () => {
    const victimData = {
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St",
    };
    const createdVictim = { id: "1", ...victimData, createdAt: new Date() };
    const expectedResponse = {
      id: "1",
      name: "John Doe",
      cpf: "123.***.***-01",
      createdAt: createdVictim.createdAt.toISOString(),
    };

    mockVictimRepository.create.mockResolvedValue(createdVictim);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .post("/victims")
      .send(victimData)
      .expect(201)
      .expect(expectedResponse);
  });

  it("/victims/:id (GET)", async () => {
    const victimId = "1";
    const victimData = {
      id: victimId,
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St",
      createdAt: new Date(),
    };
    const expectedResponse = {
      id: victimId,
      name: "John Doe",
      cpf: "123.***.***-01",
      createdAt: victimData.createdAt.toISOString(),
    };

    mockVictimRepository.findById.mockResolvedValue(victimData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .get(`/victims/${victimId}`)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/victims/:id (PUT)", async () => {
    const victimId = "1";
    const victimData = {
      name: "Updated Name",
      cpf: "12345678901",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St",
    };
    const updatedVictim = {
      id: victimId,
      ...victimData,
      createdAt: new Date(),
    };
    const expectedResponse = {
      id: victimId,
      name: "Updated Name",
      cpf: "123.***.***-01",
      createdAt: updatedVictim.createdAt.toISOString(),
    };

    mockVictimRepository.update.mockResolvedValue(updatedVictim);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .put(`/victims/${victimId}`)
      .send(victimData)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/victims/:id (DELETE)", async () => {
    const victimId = "1";

    mockVictimRepository.delete.mockResolvedValue({ affected: 1 });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .delete(`/victims/${victimId}`)
      .expect(200)
      .expect({ affected: 1 });
  });
});
