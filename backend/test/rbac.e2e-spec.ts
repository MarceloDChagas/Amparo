import { Controller, Get, UseGuards } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types"; // Import App type

import { Role } from "@/core/domain/enums/role.enum";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { JwtStrategy } from "@/infra/http/strategies/jwt.strategy";

@Controller("test-rbac")
class TestRbacController {
  @Get("admin")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  admin() {
    return "admin";
  }

  @Get("user")
  @Roles(Role.USER)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  user() {
    return "user";
  }

  @Get("public")
  public() {
    return "public";
  }
}

describe("RBAC (e2e)", () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findById: jest.fn((id: string) => {
      if (id === "admin-id") {
        return Promise.resolve({
          id: "admin-id",
          email: "admin@example.com",
          role: Role.ADMIN,
        });
      }
      if (id === "user-id") {
        return Promise.resolve({
          id: "user-id",
          email: "user@example.com",
          role: Role.USER,
        });
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: "test-secret",
          signOptions: { expiresIn: "1h" },
        }),
      ],
      controllers: [TestRbacController],
      providers: [
        JwtStrategy,
        RolesGuard,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        // Override ConfigService to return test-secret
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === "JWT_SECRET") return "test-secret";
              return null;
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/test-rbac/public (GET) - allow anonymous", () => {
    return request(app.getHttpServer())
      .get("/test-rbac/public")
      .expect(200)
      .expect("public");
  });

  it("/test-rbac/admin (GET) - block anonymous", () => {
    return request(app.getHttpServer()).get("/test-rbac/admin").expect(401);
  });

  it("/test-rbac/admin (GET) - allow admin", () => {
    const token = jwtService.sign({
      sub: "admin-id",
      email: "admin@example.com",
      role: Role.ADMIN,
    });
    return request(app.getHttpServer())
      .get("/test-rbac/admin")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("admin");
  });

  it("/test-rbac/admin (GET) - block user", () => {
    const token = jwtService.sign({
      sub: "user-id",
      email: "user@example.com",
      role: Role.USER,
    });
    return request(app.getHttpServer())
      .get("/test-rbac/admin")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("/test-rbac/user (GET) - allow user", () => {
    const token = jwtService.sign({
      sub: "user-id",
      email: "user@example.com",
      role: Role.USER,
    });
    return request(app.getHttpServer())
      .get("/test-rbac/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("user");
  });
});
