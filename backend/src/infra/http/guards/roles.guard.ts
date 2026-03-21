import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Role } from "@/core/domain/enums/role.enum";
import { ROLES_KEY } from "@/infra/http/decorators/roles.decorator";

interface UserPayload {
  role: string;
}

/**
 * RF10 — Autenticação e Autorização Segura (HIGH)
 * Guard que verifica se o usuário autenticado possui o Role necessário
 * para acessar o endpoint, bloqueando a requisição caso contrário.
 *
 * RN04 — Restrição de Acesso e Sigilo
 * Dados sensíveis das vítimas só podem ser visualizados por Admin.
 * Endpoints protegidos com `@Roles(Role.ADMIN)` garantem que outros
 * perfis do Dashboard não acessem informações completas.
 *
 * NRF02 — Arquitetura Limpa
 * Guard pertence à camada de infraestrutura HTTP, mantendo a lógica
 * de autorização separada dos use cases de domínio.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{
      user?: UserPayload;
    }>();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.some((role) => user.role.includes(role));
  }
}
