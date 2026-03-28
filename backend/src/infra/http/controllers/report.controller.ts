import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import PDFDocument from "pdfkit";

import { Role } from "@/core/domain/enums/role.enum";
import { PrismaService } from "@/infra/database/prisma.service";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

/**
 * RF16 — Geração de Relatórios Oficiais (MEDIUM)
 * Exportação de dados consolidados em PDF para envio a inquéritos
 * ou apresentação judicial.
 *
 * Endpoints:
 *  GET /reports/occurrences  — Relatório de ocorrências (com filtro de período)
 *  GET /reports/area-analysis — Análise de risco por área (heat map + ocorrências)
 */
@Controller("reports")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(Role.ADMIN)
export class ReportController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("occurrences")
  async occurrencesReport(
    @Res() res: Response,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    const where: Record<string, unknown> = {};
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const occurrences = await this.prisma.occurrence.findMany({
      where,
      include: { aggressor: true },
      orderBy: { createdAt: "desc" },
    });

    const doc: PDFKit.PDFDocument = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-ocorrencias-${Date.now()}.pdf"`,
    );

    doc.pipe(res);

    // Cabeçalho
    this.drawHeader(doc, "Relatório de Ocorrências", from, to);

    // Resumo
    doc
      .fontSize(11)
      .fillColor("#444")
      .text(`Total de ocorrências: ${occurrences.length}`, {
        continued: false,
      });
    doc.moveDown(1.2);

    if (occurrences.length === 0) {
      doc
        .fontSize(10)
        .fillColor("#666")
        .text("Nenhuma ocorrência encontrada no período.");
    } else {
      occurrences.forEach((occ, index) => {
        if (index > 0) doc.moveDown(0.5);

        doc
          .fontSize(10)
          .fillColor("#1a1a1a")
          .font("Helvetica-Bold")
          .text(
            `#${index + 1} — ${new Date(occ.createdAt).toLocaleDateString("pt-BR")}`,
            {
              continued: false,
            },
          );

        doc
          .font("Helvetica")
          .fillColor("#333")
          .text(`Descrição: ${occ.description}`)
          .text(
            `Localização: ${occ.latitude.toFixed(5)}, ${occ.longitude.toFixed(5)}`,
          )
          .text(`ID da vítima: ${occ.userId}`);

        if (occ.aggressor) {
          doc.text(`Agressor: ${occ.aggressor.name}`);
        }

        // Linha separadora
        doc
          .moveTo(50, doc.y + 6)
          .lineTo(545, doc.y + 6)
          .strokeColor("#ddd")
          .lineWidth(0.5)
          .stroke();
        doc.moveDown(0.8);
      });
    }

    this.drawFooter(doc);
    doc.end();
  }

  @Get("area-analysis")
  async areaAnalysisReport(@Res() res: Response) {
    const [heatMapCells, occurrences, aggressors] = await Promise.all([
      this.prisma.heatMapCell.findMany({
        orderBy: { riskScore: "desc" },
        take: 20,
      }),
      this.prisma.occurrence.count(),
      this.prisma.aggressor.count(),
    ]);

    const doc: PDFKit.PDFDocument = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-analise-area-${Date.now()}.pdf"`,
    );

    doc.pipe(res);

    this.drawHeader(doc, "Análise de Risco por Área");

    // Sumário estatístico
    doc
      .fontSize(12)
      .fillColor("#1a1a1a")
      .font("Helvetica-Bold")
      .text("Resumo Geral");
    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#333")
      .text(`Total de ocorrências registradas: ${occurrences}`)
      .text(`Total de agressores cadastrados: ${aggressors}`)
      .text(`Células de risco mapeadas: ${heatMapCells.length}`);
    doc.moveDown(1.5);

    // Tabela de zonas de risco
    doc
      .fontSize(12)
      .fillColor("#1a1a1a")
      .font("Helvetica-Bold")
      .text("Zonas de Maior Risco (Top 20)");
    doc.moveDown(0.6);

    if (heatMapCells.length === 0) {
      doc
        .fontSize(10)
        .fillColor("#666")
        .font("Helvetica")
        .text("Nenhuma zona de risco mapeada.");
    } else {
      // Cabeçalho da tabela
      const tableTop = doc.y;
      const col = {
        rank: 50,
        lat: 90,
        lng: 175,
        intensity: 260,
        score: 350,
        date: 420,
      };

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#fff")
        .rect(50, tableTop, 495, 16)
        .fill("#555");

      doc
        .fillColor("#fff")
        .text("#", col.rank, tableTop + 4, { width: 30, align: "center" })
        .text("Latitude", col.lat, tableTop + 4, { width: 80 })
        .text("Longitude", col.lng, tableTop + 4, { width: 80 })
        .text("Ocorrências", col.intensity, tableTop + 4, { width: 85 })
        .text("Score de risco", col.score, tableTop + 4, { width: 65 })
        .text("Última ocorr.", col.date, tableTop + 4, { width: 80 });

      let rowY = tableTop + 18;

      heatMapCells.forEach((cell, i) => {
        const bg = i % 2 === 0 ? "#f9f9f9" : "#ffffff";
        doc.rect(50, rowY, 495, 15).fill(bg);

        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor("#222")
          .text(String(i + 1), col.rank, rowY + 4, {
            width: 30,
            align: "center",
          })
          .text(cell.latitude.toFixed(4), col.lat, rowY + 4, { width: 80 })
          .text(cell.longitude.toFixed(4), col.lng, rowY + 4, { width: 80 })
          .text(String(cell.intensity), col.intensity, rowY + 4, { width: 85 })
          .text(cell.riskScore.toFixed(2), col.score, rowY + 4, { width: 65 })
          .text(
            new Date(cell.lastOccurrence).toLocaleDateString("pt-BR"),
            col.date,
            rowY + 4,
            { width: 80 },
          );

        rowY += 15;
      });

      doc
        .rect(50, tableTop, 495, rowY - tableTop)
        .strokeColor("#ccc")
        .lineWidth(0.5)
        .stroke();
      doc.y = rowY + 10;
    }

    this.drawFooter(doc);
    doc.end();
  }

  private drawHeader(
    doc: PDFKit.PDFDocument,
    title: string,
    from?: string,
    to?: string,
  ) {
    // Barra de cabeçalho
    doc.rect(0, 0, doc.page.width, 80).fill("#6b2d3e");

    doc
      .fontSize(20)
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .text("AMPARO", 50, 22);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("rgba(255,255,255,0.8)")
      .text("Sistema de Proteção à Mulher", 50, 46);

    doc
      .fontSize(14)
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .text(title, 50, 22, { align: "right", width: doc.page.width - 100 });

    doc.y = 100;
    doc.x = 50;

    // Data de geração
    const geradoEm = `Gerado em: ${new Date().toLocaleString("pt-BR")}`;
    const periodo =
      from || to
        ? `Período: ${from ? new Date(from).toLocaleDateString("pt-BR") : "início"} até ${to ? new Date(to).toLocaleDateString("pt-BR") : "hoje"}`
        : null;

    doc
      .fontSize(9)
      .fillColor("#888")
      .font("Helvetica")
      .text(geradoEm, { align: "right" });

    if (periodo) {
      doc.text(periodo, { align: "right" });
    }

    doc
      .moveTo(50, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor("#ddd")
      .lineWidth(1)
      .stroke();

    doc.moveDown(1.2);
    doc.font("Helvetica").fillColor("#333").fontSize(10);
  }

  private drawFooter(doc: PDFKit.PDFDocument) {
    const bottom = doc.page.height - 40;
    doc
      .moveTo(50, bottom)
      .lineTo(545, bottom)
      .strokeColor("#ddd")
      .lineWidth(0.5)
      .stroke();

    doc
      .fontSize(8)
      .fillColor("#aaa")
      .text(
        "Documento gerado automaticamente pelo sistema Amparo. Uso restrito a fins oficiais.",
        50,
        bottom + 8,
        { align: "center", width: 495 },
      );
  }
}
