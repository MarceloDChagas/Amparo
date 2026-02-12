import { Injectable } from "@nestjs/common";

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { IAggressorRepository } from "@/core/domain/repositories/aggressor-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaAggressorRepository implements IAggressorRepository {
  constructor(private prisma: PrismaService) {}

  async create(aggressor: Aggressor): Promise<Aggressor> {
    const createdAggressor = await this.prisma.aggressor.create({
      data: {
        id: aggressor.id,
        name: aggressor.name,
        cpf: aggressor.cpf,
      },
    });
    return new Aggressor(createdAggressor);
  }

  async findAll(): Promise<Aggressor[]> {
    const aggressors = await this.prisma.aggressor.findMany();
    return aggressors.map((aggressor) => new Aggressor(aggressor));
  }

  async findById(id: string): Promise<Aggressor | null> {
    const aggressor = await this.prisma.aggressor.findUnique({
      where: { id },
    });
    if (!aggressor) {
      return null;
    }
    return new Aggressor(aggressor);
  }

  async update(id: string, aggressor: Partial<Aggressor>): Promise<Aggressor> {
    const updatedAggressor = await this.prisma.aggressor.update({
      where: { id },
      data: aggressor,
    });
    return new Aggressor(updatedAggressor);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aggressor.delete({
      where: { id },
    });
  }
}
