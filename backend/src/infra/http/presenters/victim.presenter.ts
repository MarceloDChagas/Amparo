import { User } from "@/core/domain/entities/user.entity";
import { MaskingUtils } from "@/shared/utils/masking.utils";

export class VictimPresenter {
  static toHTTP(victim: User) {
    return {
      id: victim.id,
      name: victim.name,
      cpf: victim.cpf ? MaskingUtils.maskCPF(victim.cpf) : "",
      createdAt: victim.createdAt,
    };
  }
}
