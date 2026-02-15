export class User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
