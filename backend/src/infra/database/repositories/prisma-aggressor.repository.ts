import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { IAggressorRepository } from "@/core/domain/repositories/aggressor-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";
import { EncryptionService } from "@/infra/services/encryption.service";

@Injectable()
export class PrismaAggressorRepository implements IAggressorRepository {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async create(aggressor: Aggressor): Promise<Aggressor> {
    const createdAggressor = await this.prisma.aggressor.create({
      data: {
        id: aggressor.id,
        name: aggressor.name,
        cpf: this.encryptionService.encrypt(aggressor.cpf),
        cpfHash: this.encryptionService.hash(aggressor.cpf),
      },
    });
    return new Aggressor({
      ...createdAggressor,
      cpf: this.encryptionService.decrypt(createdAggressor.cpf),
    });
  }

  async findAll(): Promise<Aggressor[]> {
    const aggressors = await this.prisma.aggressor.findMany();
    return aggressors.map(
      (aggressor) =>
        new Aggressor({
          ...aggressor,
          cpf: this.encryptionService.decrypt(aggressor.cpf),
        }),
    );
  }

  async findById(id: string): Promise<Aggressor | null> {
    const aggressor = await this.prisma.aggressor.findUnique({
      where: { id },
    });
    if (!aggressor) {
      return null;
    }
    return new Aggressor({
      ...aggressor,
      cpf: this.encryptionService.decrypt(aggressor.cpf),
    });
  }

  async update(id: string, aggressor: Partial<Aggressor>): Promise<Aggressor> {
    const data: Prisma.AggressorUpdateInput = { ...aggressor };
    if (aggressor.cpf) {
      data.cpf = this.encryptionService.encrypt(aggressor.cpf);
      data.cpfHash = this.encryptionService.hash(aggressor.cpf);
    }

    const updatedAggressor = await this.prisma.aggressor.update({
      where: { id },
      data,
    });
    return new Aggressor({
      ...updatedAggressor,
      cpf: this.encryptionService.decrypt(updatedAggressor.cpf),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aggressor.delete({
      where: { id },
    });
  }
}
