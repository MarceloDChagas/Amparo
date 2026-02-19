import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { MaskingUtils } from "@/shared/utils/masking.utils";

export class AggressorPresenter {
  static toHTTP(aggressor: Aggressor) {
    return {
      id: aggressor.id,
      name: aggressor.name,
      cpf: MaskingUtils.maskCPF(aggressor.cpf),
    };
  }
}
