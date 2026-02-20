import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { UserRepository } from "@/core/domain/repositories/user.repository";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { DeleteVictimUseCase } from "@/core/use-cases/victim/delete-victim.use-case";
import { GetVictimUseCase } from "@/core/use-cases/victim/get-victim.use-case";
import { UpdateVictimUseCase } from "@/core/use-cases/victim/update-victim.use-case";
import { VictimController } from "@/infra/http/controllers/victim.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { AuthService } from "@/infra/services/auth.service";

describe("VictimController (e2e)", () => {
  let app: INestApplication;

  const mockUserRepository = {
    create: jest.fn(),
    findByRole: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: "mock_token" }),
    hashPassword: jest.fn().mockResolvedValue("hashed_password"),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [VictimController],
      providers: [
        // Victim use cases inject "UserRepository" string token
        GetVictimUseCase,
        UpdateVictimUseCase,
        DeleteVictimUseCase,
        { provide: "UserRepository", useValue: mockUserRepository },
        // RegisterUserUseCase injects UserRepository (class token) and AuthService (class token)
        RegisterUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: AuthService, useValue: mockAuthService },
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

  it("/victims (GET)", async () => {
    mockUserRepository.findByRole.mockResolvedValue([]);
    return request(app.getHttpServer()).get("/victims").expect(200).expect([]);
  });

  it("/victims (POST)", async () => {
    const victimData = {
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
      password: "password123",
    };
    const createdUser = {
      id: "1",
      ...victimData,
      role: "VICTIM",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expectedResponse = {
      id: "1",
      name: "John Doe",
      cpf: "123.***.***-01",
      createdAt: createdUser.createdAt.toISOString(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByCpf.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(createdUser);

    return request(app.getHttpServer())
      .post("/victims")
      .send(victimData)
      .expect(201)
      .expect(expectedResponse);
  });

  it("/victims/:id (GET)", async () => {
    const userId = "1";
    const userData = {
      id: userId,
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
      password: "hashed_password",
      role: "VICTIM",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const expectedResponse = {
      id: userId,
      name: "John Doe",
      cpf: "123.***.***-01",
      createdAt: userData.createdAt.toISOString(),
    };

    mockUserRepository.findById.mockResolvedValue(userData);

    return request(app.getHttpServer())
      .get(`/victims/${userId}`)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/victims/:id (PUT)", async () => {
    const userId = "1";
    const updateData = {
      name: "Updated Name",
    };
    const updatedUser = {
      id: userId,
      name: "Updated Name",
      cpf: "12345678901",
      email: "john.doe@example.com",
      password: "hashed_password",
      role: "VICTIM",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expectedResponse = {
      id: userId,
      name: "Updated Name",
      cpf: "123.***.***-01",
      createdAt: updatedUser.createdAt.toISOString(),
    };

    mockUserRepository.update.mockResolvedValue(updatedUser);

    return request(app.getHttpServer())
      .put(`/victims/${userId}`)
      .send(updateData)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/victims/:id (DELETE)", async () => {
    const userId = "1";

    mockUserRepository.delete.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .delete(`/victims/${userId}`)
      .expect(200);
  });
});
