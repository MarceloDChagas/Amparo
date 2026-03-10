export class Occurrence {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  aggressorId?: string | null;

  constructor(props: Occurrence) {
    Object.assign(this, props);
  }
}
