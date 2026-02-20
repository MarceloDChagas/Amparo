import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { UserRepository } from "@/core/domain/repositories/user.repository";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { DeleteUserUseCase } from "@/core/use-cases/user/delete-user.use-case";
import { GetUserUseCase } from "@/core/use-cases/user/get-user.use-case";
import { UpdateUserUseCase } from "@/core/use-cases/user/update-user.use-case";
import { UserController } from "@/infra/http/controllers/user.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { AuthService } from "@/infra/services/auth.service";

describe("UserController (e2e)", () => {
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
    login: jest.fn().mockReturnValue({ access_token: "mock_token" }),
    hashPassword: jest.fn().mockResolvedValue("hashed_password"),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        // User use cases inject "UserRepository" string token
        GetUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
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

  it("/users (GET)", async () => {
    mockUserRepository.findByRole.mockResolvedValue([]);
    return request(app.getHttpServer()).get("/users").expect(200).expect([]);
  });

  it("/users (POST)", async () => {
    const userData = {
      name: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
      password: "password123",
    };
    const createdUser = {
      id: "1",
      ...userData,
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
      .post("/users")
      .send(userData)
      .expect(201)
      .expect(expectedResponse);
  });

  it("/users/:id (GET)", async () => {
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
      .get(`/users/${userId}`)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/users/:id (PUT)", async () => {
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
      .put(`/users/${userId}`)
      .send(updateData)
      .expect(200)
      .expect(expectedResponse);
  });

  it("/users/:id (DELETE)", async () => {
    const userId = "1";

    mockUserRepository.delete.mockResolvedValue(undefined);

    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
  });
});
