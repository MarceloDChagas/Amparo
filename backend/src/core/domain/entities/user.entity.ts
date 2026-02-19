export class User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  cpf?: string;
  cpfHash?: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
