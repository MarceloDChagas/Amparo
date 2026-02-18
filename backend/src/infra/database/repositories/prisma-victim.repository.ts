import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { Victim } from "@/core/domain/entities/victim.entity";
import { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";
import { EncryptionService } from "@/infra/services/encryption.service";

@Injectable()
export class PrismaVictimRepository implements IVictimRepository {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async create(victim: Victim): Promise<Victim> {
    const createdVictim = await this.prisma.victim.create({
      data: {
        id: victim.id,
        name: victim.name,
        cpf: this.encryptionService.encrypt(victim.cpf),
        cpfHash: this.encryptionService.hash(victim.cpf),
        createdAt: victim.createdAt,
      },
    });
    return new Victim({
      ...createdVictim,
      cpf: this.encryptionService.decrypt(createdVictim.cpf),
    });
  }

  async findAll(): Promise<Victim[]> {
    const victims = await this.prisma.victim.findMany();
    return victims.map(
      (victim) =>
        new Victim({
          ...victim,
          cpf: this.encryptionService.decrypt(victim.cpf),
        }),
    );
  }

  async findById(id: string): Promise<Victim | null> {
    const victim = await this.prisma.victim.findUnique({
      where: { id },
    });
    if (!victim) {
      return null;
    }
    return new Victim({
      ...victim,
      cpf: this.encryptionService.decrypt(victim.cpf),
    });
  }

  async update(id: string, victim: Partial<Victim>): Promise<Victim> {
    const data: Prisma.VictimUpdateInput = { ...victim };
    if (victim.cpf) {
      data.cpf = this.encryptionService.encrypt(victim.cpf);
      data.cpfHash = this.encryptionService.hash(victim.cpf);
    }

    const updatedVictim = await this.prisma.victim.update({
      where: { id },
      data,
    });
    return new Victim({
      ...updatedVictim,
      cpf: this.encryptionService.decrypt(updatedVictim.cpf),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.victim.delete({
      where: { id },
    });
  }
}
