import { User } from "../entities/user.entity";

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByRole(role: string): Promise<User[]>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
