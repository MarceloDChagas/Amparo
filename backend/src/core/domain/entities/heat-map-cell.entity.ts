export class HeatMapCell {
  id?: string;
  cellKey: string;
  latitude: number;
  longitude: number;
  intensity: number;
  riskScore: number;
  lastOccurrence: Date;

  constructor(props: HeatMapCell) {
    Object.assign(this, props);
  }
}
