import { INestApplication } from "@nestjs/common";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";

import { Role } from "@/core/domain/enums/role.enum";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { PrismaService } from "@/infra/database/prisma.service";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";
import { AuditInterceptor } from "@/infra/http/interceptors/audit.interceptor";
import { JwtStrategy } from "@/infra/http/strategies/jwt.strategy";
import { AuditModule } from "@/infra/modules/audit.module";

@Controller("test-audit")
@UseGuards(AuthGuard("jwt"), RolesGuard)
class TestAuditController {
  @Get()
  @Roles(Role.ADMIN)
  index() {
    return "ok";
  }
}

describe("Audit Logging (e2e)", () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findById: jest.fn(() => {
      return Promise.resolve({
        id: "admin-id",
        email: "admin@example.com",
        role: Role.ADMIN,
      });
    }),
  };

  const mockPrismaService = {
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: "test-secret",
          signOptions: { expiresIn: "1h" },
        }),
        AuditModule,
      ],
      controllers: [TestAuditController],
      providers: [
        JwtStrategy,
        RolesGuard,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === "JWT_SECRET") return "test-secret";
              return null;
            },
          },
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: AuditInterceptor,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create an audit log when accessing a protected route", async () => {
    const token = jwtService.sign({
      sub: "admin-id",
      email: "admin@example.com",
      role: Role.ADMIN,
    });

    await request(app.getHttpServer())
      .get("/test-audit")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // Give some time for the fire-and-forget log to be saved
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify that create was called

    expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          userId: "admin-id",
          action: "GET",
          resource: "/test-audit",
        }),
      }),
    );
  });
});
