import { Injectable } from "@nestjs/common";
import type { EmergencyContact as PrismaEmergencyContact } from "@prisma/client";
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

  private mapToEntity(contact: PrismaEmergencyContact): EmergencyContact {
    return new EmergencyContact({
      id: contact.id,
      name: contact.name,
      relationship: contact.relationship,
      priority: contact.priority,
      userId: contact.userId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      phone: this.encryptionService.decrypt(contact.phone),
      email: contact.email
        ? this.encryptionService.decrypt(contact.email)
        : undefined,
    });
  }

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
        userId: contact.userId,
      },
    });
    return this.mapToEntity(createdContact);
  }

  async findAll(): Promise<EmergencyContact[]> {
    const contacts = await this.prisma.emergencyContact.findMany({
      orderBy: { priority: "asc" },
    });
    return contacts.map((contact) => this.mapToEntity(contact));
  }

  async findById(id: string): Promise<EmergencyContact | null> {
    const contact = await this.prisma.emergencyContact.findUnique({
      where: { id },
    });
    if (!contact) {
      return null;
    }
    return this.mapToEntity(contact);
  }

  async findByUserId(userId: string): Promise<EmergencyContact[]> {
    const contacts = await this.prisma.emergencyContact.findMany({
      where: { userId },
      orderBy: { priority: "asc" },
    });
    return contacts.map((contact) => this.mapToEntity(contact));
  }

  async update(
    id: string,
    contact: Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    const data: Prisma.EmergencyContactUpdateInput = {};
    if (contact.name !== undefined) data.name = contact.name;
    if (contact.relationship !== undefined)
      data.relationship = contact.relationship;
    if (contact.priority !== undefined) data.priority = contact.priority;
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
    return this.mapToEntity(updatedContact);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.emergencyContact.delete({
      where: { id },
    });
  }
}
