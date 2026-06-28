import { User } from "@/core/domain/entities/user.entity";
import { InvalidCredentialsError } from "@/core/errors/auth.errors";
import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";

// Valida o caso de uso de login (autenticação e emissão de token).
describe("LoginUseCase", () => {
  const userRepositoryMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
    findById: jest.fn(),
    findByRole: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const passwordHasherMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const tokenServiceMock = {
    sign: jest.fn(),
  };

  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(
      userRepositoryMock as never,
      passwordHasherMock,
      tokenServiceMock,
    );
  });

  // Garante falha (sem comparar senha nem assinar token) quando o e-mail não existe.
  it("should fail when user is not found", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "missing@amparo.com",
        password: "mock-password-missing-user",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(passwordHasherMock.compare).not.toHaveBeenCalled();
    expect(tokenServiceMock.sign).not.toHaveBeenCalled();
  });

  // Garante falha (sem emitir token) quando a senha não confere.
  it("should fail when password does not match", async () => {
    const user = new User({
      id: "user-1",
      email: "user@amparo.com",
      password: "mock-hashed-password",
      name: "User",
      role: "USER",
    });

    userRepositoryMock.findByEmail.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: user.email,
        password: "mock-password-invalid",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(tokenServiceMock.sign).not.toHaveBeenCalled();
  });

  // Garante que credenciais válidas retornam token e dados públicos do usuário.
  it("should return access token and public user data on success", async () => {
    const user = new User({
      id: "user-2",
      email: "user2@amparo.com",
      password: "mock-hashed-password",
      name: "User Two",
      role: "ADMIN",
    });

    userRepositoryMock.findByEmail.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(true);
    tokenServiceMock.sign.mockReturnValue("jwt-token");

    const result = await useCase.execute({
      email: user.email,
      password: "mock-password-valid",
    });

    expect(tokenServiceMock.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
      role: user.role,
    });
    expect(result).toEqual({
      access_token: "jwt-token",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });
});
