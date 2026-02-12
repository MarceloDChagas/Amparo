import { Occurrence } from "@/core/domain/entities/occurrence.entity";

export interface IOccurrenceRepository {
  create(occurrence: Occurrence): Promise<Occurrence>;
  findAll(): Promise<Occurrence[]>;
}
