import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "@/core/errors/auth.errors";
import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { AuthController } from "@/infra/http/controllers/auth.controller";

describe("AuthController (integration)", () => {
  let app: INestApplication;

  const loginUseCaseMock = {
    execute: jest.fn(),
  };

  const registerUserUseCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: loginUseCaseMock },
        { provide: RegisterUserUseCase, useValue: registerUserUseCaseMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  it("POST /auth/login returns token payload", async () => {
    loginUseCaseMock.execute.mockResolvedValue({
      access_token: "jwt-token",
      user: {
        id: "user-1",
        email: "user@amparo.local",
        name: "Maria",
        role: "USER",
      },
    });

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "user@amparo.local", password: "123456" })
      .expect(200)
      .expect({
        access_token: "jwt-token",
        user: {
          id: "user-1",
          email: "user@amparo.local",
          name: "Maria",
          role: "USER",
        },
      });
  });

  it("POST /auth/login maps invalid credentials to 401", async () => {
    loginUseCaseMock.execute.mockRejectedValue(new InvalidCredentialsError());

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "user@amparo.local", password: "invalid" })
      .expect(401);

    expect(response.body.message).toBe("Invalid credentials");
  });

  it("POST /auth/register maps duplicate user to 400", async () => {
    registerUserUseCaseMock.execute.mockRejectedValue(
      new UserAlreadyExistsError("email"),
    );

    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        name: "Maria",
        email: "maria@amparo.local",
        password: "123456",
        cpf: "12345678900",
      })
      .expect(400);

    expect(response.body.message).toBe("EMAIL already registered");
  });
});
