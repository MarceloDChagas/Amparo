import { Reflector } from "@nestjs/core";

import { Role } from "@/core/domain/enums/role.enum";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

describe("RolesGuard", () => {
  const makeContext = (user?: { role?: string }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as never;

  it("allows route without role metadata", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    };

    expect(new RolesGuard(reflector as unknown as Reflector).canActivate(makeContext())).toBe(
      true,
    );
  });

  it("blocks when authenticated user is missing", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    };

    expect(new RolesGuard(reflector as unknown as Reflector).canActivate(makeContext())).toBe(
      false,
    );
  });

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
