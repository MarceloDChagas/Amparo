import { Injectable } from "@nestjs/common";

import { Document } from "@/core/domain/entities/document.entity";
import { DocumentRepository } from "@/core/domain/repositories/document-repository";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<Document> {
    const data = await this.prisma.document.create({
      data: {
        id: document.id,
        fileName: document.fileName,
        contentType: document.contentType,
        storageKey: document.storageKey,
        sizeBytes: document.sizeBytes,
        userId: document.userId,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });

    return new Document(
      {
        fileName: data.fileName,
        contentType: data.contentType,
        storageKey: data.storageKey,
        sizeBytes: data.sizeBytes,
        userId: data.userId,
        uploadedBy: data.uploadedBy,
      },
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Document[]> {
    const docs = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return docs.map(
      (data) =>
        new Document(
          {
            fileName: data.fileName,
            contentType: data.contentType,
            storageKey: data.storageKey,
            sizeBytes: data.sizeBytes,
            userId: data.userId,
            uploadedBy: data.uploadedBy,
          },
          data.id,
          data.createdAt,
          data.updatedAt,
        ),
    );
  }

  async findById(id: string): Promise<Document | null> {
    const data = await this.prisma.document.findUnique({ where: { id } });
    if (!data) return null;

    return new Document(
      {
        fileName: data.fileName,
        contentType: data.contentType,
        storageKey: data.storageKey,
        sizeBytes: data.sizeBytes,
        userId: data.userId,
        uploadedBy: data.uploadedBy,
      },
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }
}
