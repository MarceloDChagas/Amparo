import { Injectable } from "@nestjs/common";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password!,
        name: user.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        role: user.role as any,
      },
    });
    return new User(createdUser as Partial<User>);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return new User(user as Partial<User>);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new User(user as Partial<User>);
  }
}
