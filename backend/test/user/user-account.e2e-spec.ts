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

describe("UserController (user e2e)", () => {
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
      .overrideGuard(AuthGuard("jwt"))
      .useValue({
        canActivate: (context: { switchToHttp: () => { getRequest: () => { user?: { id: string } } } }) => {
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

  it("DELETE /users/me removes the authenticated user", async () => {
    mockUserRepository.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete("/users/me").expect(204);

    expect(mockUserRepository.delete).toHaveBeenCalledWith("self-user-id");
  });

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

    await request(app.getHttpServer())
      .get("/users/user-2")
      .expect(200)
      .expect({
        id: "user-2",
        name: "Joana",
        cpf: "123.***.***-01",
        createdAt: createdAt.toISOString(),
      });
  });
});
