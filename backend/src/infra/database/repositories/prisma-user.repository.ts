import { Injectable } from "@nestjs/common";
import type { User as PrismaUser } from "@prisma/client";

import { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import { PrismaService } from "@/infra/database/prisma.service";
import { EncryptionService } from "@/infra/services/encryption.service";

type PrismaUserCreateInput = {
  email: string;
  password: string;
  name: string;
  role: "USER" | "ADMIN";
  cpf?: string;
  cpfHash?: string;
};

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  private mapToEntity(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      name: prismaUser.name,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      cpf: prismaUser.cpf
        ? this.encryptionService.decrypt(prismaUser.cpf)
        : undefined,
    });
  }

  async create(user: User): Promise<User> {
    const data: PrismaUserCreateInput = {
      email: user.email,
      password: user.password!,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
    };

    if (user.cpf) {
      data.cpf = this.encryptionService.encrypt(user.cpf);
      data.cpfHash = this.encryptionService.hash(user.cpf);
    }

    const createdUser = await this.prisma.user.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      data: data as any,
    });

    return this.mapToEntity(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const cpfHash = this.encryptionService.hash(cpf);
    const user = await this.prisma.user.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      where: { cpfHash } as any,
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.withRetry(() =>
      this.prisma.user.findUnique({ where: { id } }),
    );
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByRole(role: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role: role as "USER" | "ADMIN" },
    });
    return users.map((user) => this.mapToEntity(user));
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updateData: Partial<PrismaUserCreateInput> = {};
    if (user.name !== undefined) updateData.name = user.name;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.password !== undefined) updateData.password = user.password;
    if (user.role !== undefined)
      updateData.role = user.role as "USER" | "ADMIN";
    if (user.cpf) {
      updateData.cpf = this.encryptionService.encrypt(user.cpf);
      updateData.cpfHash = this.encryptionService.hash(user.cpf);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      data: updateData as any,
    });
    return this.mapToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
