import { Injectable } from "@nestjs/common";

import { Victim } from "@/core/domain/entities/victim.entity";
import { IVictimRepository } from "@/core/domain/repositories/victim-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaVictimRepository implements IVictimRepository {
  constructor(private prisma: PrismaService) {}

  async create(victim: Victim): Promise<Victim> {
    const createdVictim = await this.prisma.victim.create({
      data: {
        id: victim.id,
        name: victim.name,
        cpf: victim.cpf,
        createdAt: victim.createdAt,
      },
    });
    return new Victim(createdVictim);
  }

  async findAll(): Promise<Victim[]> {
    const victims = await this.prisma.victim.findMany();
    return victims.map((victim) => new Victim(victim));
  }

  async findById(id: string): Promise<Victim | null> {
    const victim = await this.prisma.victim.findUnique({
      where: { id },
    });
    if (!victim) {
      return null;
    }
    return new Victim(victim);
  }

  async update(id: string, victim: Partial<Victim>): Promise<Victim> {
    const updatedVictim = await this.prisma.victim.update({
      where: { id },
      data: victim,
    });
    return new Victim(updatedVictim);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.victim.delete({
      where: { id },
    });
  }
}
