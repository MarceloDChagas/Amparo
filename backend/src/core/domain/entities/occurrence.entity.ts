export class Occurrence {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  victimId: string;
  aggressorId: string;

  constructor(props: Occurrence) {
    Object.assign(this, props);
  }
}
