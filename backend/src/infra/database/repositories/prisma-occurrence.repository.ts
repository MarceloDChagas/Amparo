import { Injectable } from "@nestjs/common";
import type { Occurrence as PrismaOccurrence } from "@prisma/client";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { IOccurrenceRepository } from "@/core/domain/repositories/occurrence-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaOccurrenceRepository implements IOccurrenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(occ: PrismaOccurrence): Occurrence {
    return new Occurrence({
      id: occ.id,
      description: occ.description,
      latitude: occ.latitude,
      longitude: occ.longitude,
      userId: occ.userId,
      aggressorId: occ.aggressorId,
    });
  }

  async create(occurrence: Occurrence): Promise<Occurrence> {
    const created = await this.prisma.occurrence.create({
      data: {
        description: occurrence.description,
        latitude: occurrence.latitude,
        longitude: occurrence.longitude,
        userId: occurrence.userId,
        aggressorId: occurrence.aggressorId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Occurrence[]> {
    const occurrences = await this.prisma.occurrence.findMany();
    return occurrences.map((occ) => this.mapToEntity(occ));
  }
}
