import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const keyString =
      this.configService.get<string>("ENCRYPTION_KEY") ||
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // Default 32 bytes hex for dev
    this.key = Buffer.from(keyString, "hex");
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
  }

  decrypt(text: string): string {
    const [ivHex, encryptedHex, authTagHex] = text.split(":");
    if (!ivHex || !encryptedHex || !authTagHex) {
      throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}
