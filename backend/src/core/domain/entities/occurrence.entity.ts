export class Occurrence {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  aggressorId?: string | null;
  createdAt?: Date;

  constructor(props: Occurrence) {
    Object.assign(this, props);
  }
}
