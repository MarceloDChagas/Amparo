import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserRepository } from "@/core/domain/repositories/user.repository";

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "fallback-secret",
    });
  }

  async validate(payload: JwtPayload) {
    // Payload contains { email, sub, role, iat, exp }
    // We could return full user or just payload.
    // Let's verify user exists.
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      return null;
    }
    // Return user object which will be injected into Request object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
