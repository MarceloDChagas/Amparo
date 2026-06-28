import { INestApplication } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import {
  PASSWORD_HASHER_PORT,
  TOKEN_SERVICE_PORT,
} from "@/core/ports/auth.ports";
import { USER_REPOSITORY } from "@/core/ports/user-repository.ports";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { DeleteUserUseCase } from "@/core/use-cases/user/delete-user.use-case";
import { GetUserUseCase } from "@/core/use-cases/user/get-user.use-case";
import { UpdateUserUseCase } from "@/core/use-cases/user/update-user.use-case";
import { UserController } from "@/infra/http/controllers/user.controller";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

describe("UserController (integration)", () => {
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

  const mockPasswordHasher = {
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn(),
  };

  const mockTokenService = {
    sign: jest.fn().mockReturnValue("mock_token"),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        GetUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        RegisterUserUseCase,
        { provide: PASSWORD_HASHER_PORT, useValue: mockPasswordHasher },
        { provide: TOKEN_SERVICE_PORT, useValue: mockTokenService },
      ],
    })
      // Inject an authenticated user so routes that rely on `req.user`
      // (e.g. DELETE /users/me) resolve the identity deterministically.
      .overrideGuard(AuthGuard("jwt"))
      .useValue({
        canActivate: (context: {
          switchToHttp: () => { getRequest: () => { user?: { id: string } } };
        }) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: "self-user-id" };
          return true;
        },
      })
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

  // Garante que a listagem retorna lista vazia quando não há usuários.
  it("GET /users returns an empty list when there are no users", async () => {
    mockUserRepository.findByRole.mockResolvedValue([]);

    await request(app.getHttpServer()).get("/users").expect(200).expect([]);
  });

  // Garante que criar usuário retorna a resposta com CPF mascarado e sem dados sensíveis.
  it("POST /users creates a user and returns a masked response", async () => {
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
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByCpf.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(createdUser);
    mockUserRepository.findById.mockResolvedValue(createdUser);

    await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(201)
      .expect({
        id: "1",
        name: "John Doe",
        cpf: "123.***.***-01",
        createdAt: createdUser.createdAt.toISOString(),
      });
  });

  // Garante que buscar usuário por id retorna resposta com CPF mascarado.
  it("GET /users/:id returns a masked user response", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    mockUserRepository.findById.mockResolvedValue({
      id: "user-2",
      name: "Joana",
      cpf: "12345678901",
      email: "joana@amparo.local",
      password: "hashed_password",
      role: "USER",
      createdAt,
      updatedAt: createdAt,
    });

    await request(app.getHttpServer()).get("/users/user-2").expect(200).expect({
      id: "user-2",
      name: "Joana",
      cpf: "123.***.***-01",
      createdAt: createdAt.toISOString(),
    });
  });

  // Garante que atualizar usuário retorna resposta com CPF mascarado.
  it("PUT /users/:id updates a user and returns a masked response", async () => {
    const updatedUser = {
      id: "1",
      name: "Updated Name",
      cpf: "12345678901",
      email: "john.doe@example.com",
      password: "hashed_password",
      role: "VICTIM",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    mockUserRepository.update.mockResolvedValue(updatedUser);

    await request(app.getHttpServer())
      .put("/users/1")
      .send({ name: "Updated Name" })
      .expect(200)
      .expect({
        id: "1",
        name: "Updated Name",
        cpf: "123.***.***-01",
        createdAt: updatedUser.createdAt.toISOString(),
      });
  });

  // Garante que admin remove um usuário pelo id.
  it("DELETE /users/:id removes a user by id", async () => {
    mockUserRepository.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete("/users/1").expect(200);

    expect(mockUserRepository.delete).toHaveBeenCalledWith("1");
  });

  // Garante que /users/me remove a própria conta do usuário autenticado.
  it("DELETE /users/me removes the authenticated user", async () => {
    mockUserRepository.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete("/users/me").expect(204);

    expect(mockUserRepository.delete).toHaveBeenCalledWith("self-user-id");
  });
});
