import { Injectable } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaOccurrenceRepository implements IOccurrenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(occurrence: Occurrence): Promise<Occurrence> {
    const created = await this.prisma.occurrence.create({
      data: {
        description: occurrence.description,
        latitude: occurrence.latitude,
        longitude: occurrence.longitude,
        victimId: occurrence.victimId,
        aggressorId: occurrence.aggressorId,
      },
    });
    return new Occurrence(created);
  }

  async findAll(): Promise<Occurrence[]> {
    const occurrences = await this.prisma.occurrence.findMany();
    return occurrences.map((occ) => new Occurrence(occ));
  }
}
