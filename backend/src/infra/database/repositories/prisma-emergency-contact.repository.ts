import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";
import { EncryptionService } from "@/infra/services/encryption.service";

@Injectable()
export class PrismaEmergencyContactRepository implements IEmergencyContactRepository {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async create(contact: EmergencyContact): Promise<EmergencyContact> {
    const createdContact = await this.prisma.emergencyContact.create({
      data: {
        name: contact.name,
        phone: this.encryptionService.encrypt(contact.phone),
        email: contact.email
          ? this.encryptionService.encrypt(contact.email)
          : null,
        relationship: contact.relationship,
        priority: contact.priority,
        victimId: contact.victimId,
      },
    });
    return new EmergencyContact({
      ...createdContact,
      phone: this.encryptionService.decrypt(createdContact.phone),
      email: createdContact.email
        ? this.encryptionService.decrypt(createdContact.email)
        : undefined,
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
          phone: this.encryptionService.decrypt(contact.phone),
          email: contact.email
            ? this.encryptionService.decrypt(contact.email)
            : undefined,
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
      phone: this.encryptionService.decrypt(contact.phone),
      email: contact.email
        ? this.encryptionService.decrypt(contact.email)
        : undefined,
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
          phone: this.encryptionService.decrypt(contact.phone),
          email: contact.email
            ? this.encryptionService.decrypt(contact.email)
            : undefined,
        }),
    );
  }

  async update(
    id: string,
    contact: Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    const data: Prisma.EmergencyContactUpdateInput = { ...contact };
    if (contact.phone) {
      data.phone = this.encryptionService.encrypt(contact.phone);
    }
    if (contact.email) {
      data.email = this.encryptionService.encrypt(contact.email);
    }

    const updatedContact = await this.prisma.emergencyContact.update({
      where: { id },
      data,
    });
    return new EmergencyContact({
      ...updatedContact,
      phone: this.encryptionService.decrypt(updatedContact.phone),
      email: updatedContact.email
        ? this.encryptionService.decrypt(updatedContact.email)
        : undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.emergencyContact.delete({
      where: { id },
    });
  }
}
