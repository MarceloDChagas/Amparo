import { Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { MOCK_USERS } from "@/infra/database/mock-data";

/**
 * Mock User Repository with hardcoded users for development
 * without database dependency
 */
@Injectable()
export class MockUserRepository implements UserRepository {
  // Initialize with hardcoded example users
  private mockUsers: Map<string, User> = new Map(Object.entries(MOCK_USERS));

  create(user: User): Promise<User> {
    const newUser = new User({
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.mockUsers.set(newUser.id, newUser);
    return Promise.resolve(newUser);
  }

  findByEmail(email: string): Promise<User | null> {
    for (const user of this.mockUsers.values()) {
      if (user.email === email) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  }

  findByCpf(cpf: string): Promise<User | null> {
    for (const user of this.mockUsers.values()) {
      if (user.cpf === cpf) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.mockUsers.get(id) ?? null);
  }

  findByRole(role: string): Promise<User[]> {
    const users: User[] = [];
    for (const user of this.mockUsers.values()) {
      if (user.role === role) {
        users.push(user);
      }
    }
    return Promise.resolve(users);
  }

  update(id: string, user: Partial<User>): Promise<User> {
    const existingUser = this.mockUsers.get(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = new User({
      ...existingUser,
      ...user,
      id: existingUser.id,
      createdAt: existingUser.createdAt,
      updatedAt: new Date(),
    });
    this.mockUsers.set(id, updatedUser);
    return Promise.resolve(updatedUser);
  }

  delete(id: string): Promise<void> {
    this.mockUsers.delete(id);
    return Promise.resolve();
  }
}
