import { Module } from "@nestjs/common";

import { ReportController } from "@/infra/http/controllers/report.controller";

/**
 * RF16 — Geração de Relatórios Oficiais (MEDIUM)
 * Fornece endpoints para geração de PDFs consolidados de ocorrências
 * e análise de risco por área geográfica.
 */
@Module({
  controllers: [ReportController],
})
export class ReportModule {}
