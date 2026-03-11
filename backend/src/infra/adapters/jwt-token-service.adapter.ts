import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { TokenServicePort } from "@/core/ports/auth.ports";

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(private jwtService: JwtService) {}

  sign(payload: { email: string; sub: string; role: string }): string {
    return this.jwtService.sign(payload);
  }
}
