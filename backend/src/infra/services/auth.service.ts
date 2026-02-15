import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { User } from "@/core/domain/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    email: string,
    pass: string,
    user: User | null,
  ): Promise<Omit<User, "password"> | null> {
    if (user && (await bcrypt.compare(pass, user.password!))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
