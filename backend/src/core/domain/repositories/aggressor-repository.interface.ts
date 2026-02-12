import { Aggressor } from "@/core/domain/entities/aggressor.entity";

export interface IAggressorRepository {
  create(aggressor: Aggressor): Promise<Aggressor>;
  findAll(): Promise<Aggressor[]>;
  findById(id: string): Promise<Aggressor | null>;
  update(id: string, aggressor: Partial<Aggressor>): Promise<Aggressor>;
  delete(id: string): Promise<void>;
}
