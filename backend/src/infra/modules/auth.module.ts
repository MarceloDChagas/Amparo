import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserRepository } from "@/core/domain/repositories/user.repository";
import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";
import { RegisterUserUseCase } from "@/core/use-cases/auth/register-user.use-case";
import { PrismaUserRepository } from "@/infra/database/repositories/prisma-user.repository";
import { AuthController } from "@/infra/http/controllers/auth.controller";
import { JwtStrategy } from "@/infra/http/strategies/jwt.strategy";
import { AuthService } from "@/infra/services/auth.service";

import { DatabaseModule } from "./database.module";

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: (configService.get<string>("JWT_EXPIRES_IN") ||
            "1d") as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LoginUseCase,
    RegisterUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
