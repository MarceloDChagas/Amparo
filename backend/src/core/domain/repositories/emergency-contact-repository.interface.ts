import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";

export interface IEmergencyContactRepository {
  create(contact: EmergencyContact): Promise<EmergencyContact>;
  findAll(): Promise<EmergencyContact[]>;
  findById(id: string): Promise<EmergencyContact | null>;
  findByVictimId(victimId: string): Promise<EmergencyContact[]>;
  update(
    id: string,
    contact: Partial<EmergencyContact>,
  ): Promise<EmergencyContact>;
  delete(id: string): Promise<void>;
}
