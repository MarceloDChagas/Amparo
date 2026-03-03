import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT", "minio"),
      port: parseInt(this.configService.get<string>("MINIO_PORT", "9000"), 10),
      useSSL:
        this.configService.get<string>("MINIO_USE_SSL", "false") === "true",
      accessKey: this.configService.get<string>(
        "MINIO_ROOT_USER",
        "minioadmin",
      ),
      secretKey: this.configService.get<string>(
        "MINIO_ROOT_PASSWORD",
        "minioadmin",
      ),
    });

    this.bucket = this.configService.get<string>(
      "MINIO_BUCKET_NAME",
      "amparo-docs",
    );
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      this.logger.log(`Bucket "${this.bucket}" criado com sucesso.`);
    } else {
      this.logger.log(`Bucket "${this.bucket}" já existe.`);
    }
  }

  /**
   * Gera uma Presigned URL para upload (PUT) direto pelo cliente.
   * @param key  Chave do objeto no bucket (ex: documents/{userId}/{ts}-{name})
   * @param expirySeconds  Validade da URL em segundos (padrão: 15 min)
   */
  async getPresignedUploadUrl(
    key: string,
    expirySeconds = 900,
  ): Promise<string> {
    return this.client.presignedPutObject(this.bucket, key, expirySeconds);
  }

  /**
   * Gera uma Presigned URL para download (GET).
   * @param key  Chave do objeto no bucket
   * @param expirySeconds  Validade em segundos (padrão: 1h)
   */
  async getPresignedDownloadUrl(
    key: string,
    expirySeconds = 3600,
  ): Promise<string> {
    return this.client.presignedGetObject(this.bucket, key, expirySeconds);
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
    this.logger.log(`Objeto removido: "${key}"`);
  }
}
