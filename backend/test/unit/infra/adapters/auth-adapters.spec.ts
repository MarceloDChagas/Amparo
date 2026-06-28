import { BcryptPasswordHasherAdapter } from "@/infra/adapters/bcrypt-password-hasher.adapter";
import { EmergencyAlertTemplateRendererAdapter } from "@/infra/adapters/emergency-alert-template-renderer.adapter";
import { JwtTokenServiceAdapter } from "@/infra/adapters/jwt-token-service.adapter";

// Valida os adapters de autenticação (hash bcrypt, assinatura JWT) e o renderizador de template.
describe("Auth and template adapters", () => {
  // Garante que o bcrypt gera hash diferente da senha e compara certo/errado corretamente.
  it("hashes and compares passwords with bcrypt", async () => {
    const adapter = new BcryptPasswordHasherAdapter();

    const hashed = await adapter.hash("plain-password");

    expect(hashed).not.toBe("plain-password");
    await expect(adapter.compare("plain-password", hashed)).resolves.toBe(true);
    await expect(adapter.compare("wrong-password", hashed)).resolves.toBe(
      false,
    );
  });

  // Garante que a assinatura do token é delegada ao JwtService com o payload recebido.
  it("delegates JWT signing to JwtService", () => {
    const jwtService = {
      sign: jest.fn().mockReturnValue("jwt-token"),
    };
    const payload = {
      email: "admin@amparo.local",
      sub: "user-1",
      role: "ADMIN",
    };

    expect(new JwtTokenServiceAdapter(jwtService as never).sign(payload)).toBe(
      "jwt-token",
    );
    expect(jwtService.sign).toHaveBeenCalledWith(payload);
  });

  // Garante que o template de alerta inclui nome, link de localização e endereço.
  it("renders emergency alert templates", () => {
    const html =
      new EmergencyAlertTemplateRendererAdapter().renderEmergencyAlert({
        userName: "Maria",
        locationLink: "https://maps.example",
        time: "17/06/2026 12:00",
        address: "Rua Segura, 123",
      });

    expect(html).toContain("Maria");
    expect(html).toContain("https://maps.example");
    expect(html).toContain("Rua Segura, 123");
  });
});
