import { Reflector } from "@nestjs/core";

import { Role } from "@/core/domain/enums/role.enum";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

// Valida o guard de autorização por papel (RBAC).
describe("RolesGuard", () => {
  const makeContext = (user?: { role?: string }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as never;

  // Garante que rota sem metadado de papel é liberada.
  it("allows route without role metadata", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    };

    expect(
      new RolesGuard(reflector as unknown as Reflector).canActivate(
        makeContext(),
      ),
    ).toBe(true);
  });

  // Garante que rota protegida bloqueia quando não há usuário autenticado.
  it("blocks when authenticated user is missing", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    };

    expect(
      new RolesGuard(reflector as unknown as Reflector).canActivate(
        makeContext(),
      ),
    ).toBe(false);
  });

  // Garante que usuário com o papel exigido é liberado.
  it("allows user with a required role", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    };

    expect(
      new RolesGuard(reflector as unknown as Reflector).canActivate(
        makeContext({ role: Role.ADMIN }),
      ),
    ).toBe(true);
  });

  // Garante que usuário sem o papel exigido é bloqueado.
  it("blocks user without a required role", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    };

    expect(
      new RolesGuard(reflector as unknown as Reflector).canActivate(
        makeContext({ role: Role.USER }),
      ),
    ).toBe(false);
  });
});
