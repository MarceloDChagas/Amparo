import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PasswordHasherPort } from "@/core/ports/auth.ports";

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
