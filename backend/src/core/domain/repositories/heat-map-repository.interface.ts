import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";

export interface IHeatMapRepository {
  findAll(): Promise<HeatMapCell[]>;
  replaceAll(cells: HeatMapCell[]): Promise<void>;
  upsertFromOccurrence(occurrence: {
    latitude: number;
    longitude: number;
    aggressorId?: string | null;
    createdAt?: Date;
  }): Promise<void>;
}
