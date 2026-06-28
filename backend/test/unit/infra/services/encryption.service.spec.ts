import { ConfigService } from "@nestjs/config";

import { EncryptionService } from "@/infra/services/encryption.service";

// Valida o serviço de criptografia (cifrar/decifrar e hash determinístico).
describe("EncryptionService", () => {
  const configService = {
    get: jest
      .fn()
      .mockReturnValue(
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      ),
  };

  // Garante que o texto cifrado difere do original e decifra de volta ao valor inicial.
  it("encrypts and decrypts text", () => {
    const service = new EncryptionService(
      configService as unknown as ConfigService,
    );

    const encrypted = service.encrypt("sensitive");

    expect(encrypted).not.toBe("sensitive");
    expect(service.decrypt(encrypted)).toBe("sensitive");
  });

  // Garante que texto cifrado em formato inválido é rejeitado.
  it("rejects invalid encrypted text format", () => {
    const service = new EncryptionService(
      configService as unknown as ConfigService,
    );

    expect(() => service.decrypt("invalid")).toThrow(
      "Invalid encrypted text format",
    );
  });

  // Garante que o hash é determinístico (mesma entrada → mesmo hash) e tem 64 chars (sha256).
  it("creates deterministic sha256 hashes", () => {
    const service = new EncryptionService(
      configService as unknown as ConfigService,
    );

    expect(service.hash("cpf")).toBe(service.hash("cpf"));
    expect(service.hash("cpf")).toHaveLength(64);
  });
});
