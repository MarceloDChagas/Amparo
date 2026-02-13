export class EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  victimId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: EmergencyContact) {
    Object.assign(this, props);
  }
}
