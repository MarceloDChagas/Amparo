export class Victim {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;

  constructor(props: Victim) {
    Object.assign(this, props);
  }
}
