import { authService } from "@/services/auth-service";

describe("authService", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true,
    });
    fetchMock.mockReset();
  });

  it("should login successfully", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "token-123",
        user: {
          id: "user-1",
          email: "user@amparo.com",
          name: "User",
          role: "USER",
        },
      }),
    });

    const result = await authService.login({
      email: "user@amparo.com",
      password: "123456",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.access_token).toBe("token-123");
  });

  it("should throw error when login fails", async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(
      authService.login({ email: "x@x.com", password: "wrong" }),
    ).rejects.toThrow("Login failed");
  });

  it("should throw API message when register fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Email already registered" }),
    });

    await expect(
      authService.register({
        name: "Maria",
        email: "maria@amparo.com",
        password: "123456",
      }),
    ).rejects.toThrow("Email already registered");
  });

  it("should use fallback error when register response has no body", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    await expect(
      authService.register({
        name: "Ana",
        email: "ana@amparo.com",
        password: "123456",
      }),
    ).rejects.toThrow("Registration failed");
  });
});
