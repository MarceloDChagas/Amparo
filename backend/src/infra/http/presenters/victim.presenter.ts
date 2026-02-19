import { Victim } from "@/core/domain/entities/victim.entity";
import { MaskingUtils } from "@/shared/utils/masking.utils";

export class VictimPresenter {
  static toHTTP(victim: Victim) {
    return {
      id: victim.id,
      name: victim.name,
      cpf: MaskingUtils.maskCPF(victim.cpf),
      createdAt: victim.createdAt,
    };
  }
}
