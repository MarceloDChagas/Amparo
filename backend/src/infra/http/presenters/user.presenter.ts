import { User } from "@/core/domain/entities/user.entity";
import { MaskingUtils } from "@/shared/utils/masking.utils";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf ? MaskingUtils.maskCPF(user.cpf) : "",
      createdAt: user.createdAt,
    };
  }
}
