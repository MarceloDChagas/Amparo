import { Injectable } from "@nestjs/common";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaEmergencyContactRepository implements IEmergencyContactRepository {
  constructor(private prisma: PrismaService) {}

  async create(contact: EmergencyContact): Promise<EmergencyContact> {
    const createdContact = await this.prisma.emergencyContact.create({
      data: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
        priority: contact.priority,
        victimId: contact.victimId,
      },
    });
    return new EmergencyContact({
      ...createdContact,
      email: createdContact.email ?? undefined,
    });
  }

  async findAll(): Promise<EmergencyContact[]> {
    const contacts = await this.prisma.emergencyContact.findMany({
      orderBy: { priority: "asc" },
    });
    return contacts.map(
      (contact) =>
        new EmergencyContact({
          ...contact,
          email: contact.email ?? undefined,
        }),
    );
  }

  async findById(id: string): Promise<EmergencyContact | null> {
    const contact = await this.prisma.emergencyContact.findUnique({
      where: { id },
    });
    if (!contact) {
      return null;
    }
    return new EmergencyContact({
      ...contact,
      email: contact.email ?? undefined,
    });
  }

  async findByVictimId(victimId: string): Promise<EmergencyContact[]> {
    const contacts = await this.prisma.emergencyContact.findMany({
      where: { victimId },
      orderBy: { priority: "asc" },
    });
    return contacts.map(
      (contact) =>
        new EmergencyContact({
          ...contact,
          email: contact.email ?? undefined,
        }),
    );
  }

  async update(
    id: string,
    contact: Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    const updatedContact = await this.prisma.emergencyContact.update({
      where: { id },
      data: contact,
    });
    return new EmergencyContact({
      ...updatedContact,
      email: updatedContact.email ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.emergencyContact.delete({
      where: { id },
    });
  }
}
