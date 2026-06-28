import { UserAlreadyExistsError } from "@/core/errors/auth.errors";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";

// Valida o cadastro de usuário (unicidade de e-mail/CPF, hash de senha e emissão de token).
describe("RegisterUserUseCase", () => {
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

  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUserUseCase(
      userRepositoryMock as never,
      passwordHasherMock,
      tokenServiceMock,
    );
  });

  // Garante que e-mail já cadastrado bloqueia o registro antes de checar CPF/criar.
  it("should reject duplicate email", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({ id: "existing" });

    await expect(
      useCase.execute({
        name: "Maria",
        email: "maria@amparo.com",
        password: "strong-pass",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(userRepositoryMock.findByCpf).not.toHaveBeenCalled();
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  // Garante que CPF já cadastrado (quando informado) bloqueia o registro.
  it("should reject duplicate cpf when provided", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.findByCpf.mockResolvedValue({ id: "existing-cpf" });

    await expect(
      useCase.execute({
        name: "Joana",
        email: "joana@amparo.com",
        password: "strong-pass",
        cpf: "12345678900",
      }),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  // Garante o fluxo feliz: senha é hasheada, usuário é criado com papel USER e token é emitido.
  it("should hash password, create user and issue token", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.findByCpf.mockResolvedValue(null);
    passwordHasherMock.hash.mockResolvedValue("hashed-password");
    userRepositoryMock.create.mockImplementation(
      (user: { password: string; role: string }) =>
        Promise.resolve({
          ...user,
          id: "user-99",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
    );
    tokenServiceMock.sign.mockReturnValue("new-token");

    const result = await useCase.execute({
      name: "Ana",
      email: "ana@amparo.com",
      password: "plain-password",
      cpf: "11122233344",
    });

    expect(passwordHasherMock.hash).toHaveBeenCalledWith("plain-password");
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed-password",
        role: "USER",
      }),
    );

    expect(tokenServiceMock.sign).toHaveBeenCalledWith({
      email: "ana@amparo.com",
      sub: "user-99",
      role: "USER",
    });

    expect(result).toEqual({
      access_token: "new-token",
      user: {
        id: "user-99",
        email: "ana@amparo.com",
        name: "Ana",
        role: "USER",
      },
    });
  });
});
