import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { MaskingUtils } from "@/shared/utils/masking.utils";

export class EmergencyContactPresenter {
  static toHTTP(contact: EmergencyContact) {
    return {
      id: contact.id,
      name: contact.name,
      phone: MaskingUtils.maskPhone(contact.phone),
      email: contact.email ? MaskingUtils.maskEmail(contact.email) : undefined,
      relationship: contact.relationship,
      priority: contact.priority,
      userId: contact.userId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
