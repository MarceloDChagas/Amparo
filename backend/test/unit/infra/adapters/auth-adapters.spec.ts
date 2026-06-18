import { BcryptPasswordHasherAdapter } from "@/infra/adapters/bcrypt-password-hasher.adapter";
import { EmergencyAlertTemplateRendererAdapter } from "@/infra/adapters/emergency-alert-template-renderer.adapter";
import { JwtTokenServiceAdapter } from "@/infra/adapters/jwt-token-service.adapter";

describe("Auth and template adapters", () => {
  it("hashes and compares passwords with bcrypt", async () => {
    const adapter = new BcryptPasswordHasherAdapter();

    const hashed = await adapter.hash("plain-password");

    expect(hashed).not.toBe("plain-password");
    await expect(adapter.compare("plain-password", hashed)).resolves.toBe(true);
    await expect(adapter.compare("wrong-password", hashed)).resolves.toBe(false);
  });

  it("delegates JWT signing to JwtService", () => {
    const jwtService = {
      sign: jest.fn().mockReturnValue("jwt-token"),
    };
    const payload = { email: "admin@amparo.local", sub: "user-1", role: "ADMIN" };

    expect(new JwtTokenServiceAdapter(jwtService as never).sign(payload)).toBe(
      "jwt-token",
    );
    expect(jwtService.sign).toHaveBeenCalledWith(payload);
  });

  it("renders emergency alert templates", () => {
    const html = new EmergencyAlertTemplateRendererAdapter().renderEmergencyAlert({
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
