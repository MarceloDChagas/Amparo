export class Aggressor {
  id: string;
  name: string;
  cpf: string;

  constructor(props: Aggressor) {
    Object.assign(this, props);
  }
}
