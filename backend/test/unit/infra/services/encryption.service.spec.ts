import { ConfigService } from "@nestjs/config";

import { EncryptionService } from "@/infra/services/encryption.service";

describe("EncryptionService", () => {
  const configService = {
    get: jest.fn().mockReturnValue(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    ),
  };

  it("encrypts and decrypts text", () => {
    const service = new EncryptionService(configService as unknown as ConfigService);

    const encrypted = service.encrypt("sensitive");

    expect(encrypted).not.toBe("sensitive");
    expect(service.decrypt(encrypted)).toBe("sensitive");
  });

  it("rejects invalid encrypted text format", () => {
    const service = new EncryptionService(configService as unknown as ConfigService);

    expect(() => service.decrypt("invalid")).toThrow(
      "Invalid encrypted text format",
    );
  });

  it("creates deterministic sha256 hashes", () => {
    const service = new EncryptionService(configService as unknown as ConfigService);

    expect(service.hash("cpf")).toBe(service.hash("cpf"));
    expect(service.hash("cpf")).toHaveLength(64);
  });
});
