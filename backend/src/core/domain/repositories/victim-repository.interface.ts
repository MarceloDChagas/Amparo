import { Victim } from "@/core/domain/entities/victim.entity";

export interface IVictimRepository {
  create(victim: Victim): Promise<Victim>;
  findAll(): Promise<Victim[]>;
  findById(id: string): Promise<Victim | null>;
  update(id: string, victim: Partial<Victim>): Promise<Victim>;
  delete(id: string): Promise<void>;
}
