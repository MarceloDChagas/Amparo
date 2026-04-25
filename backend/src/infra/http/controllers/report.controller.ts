import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import PDFDocument from "pdfkit";

import { Role } from "@/core/domain/enums/role.enum";
import { PrismaService } from "@/infra/database/prisma.service";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  brand: "#6b2d3e",
  primary: "#244b7a",
  danger: "#dc2626",
  warning: "#d97706",
  success: "#16a34a",
  muted: "#6b7280",
  surface: "#f7f8fa",
  border: "#e5e7eb",
  ink: "#111827",
  inkSoft: "#374151",
  white: "#ffffff",
};

// ── Geocodificação reversa (Nominatim OSM) ────────────────────────────────────
// Máx 1 req/s conforme ToS. Usada apenas para o Top 5 de zonas críticas.
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Amparo-Report/1.0 (sistema de proteção à mulher)",
      },
    });
    if (!res.ok) return formatCoords(lat, lng);
    const data = (await res.json()) as {
      address?: {
        suburb?: string;
        neighbourhood?: string;
        road?: string;
        town?: string;
        city?: string;
      };
      display_name?: string;
    };
    const a = data.address ?? {};
    return (
      a.suburb ??
      a.neighbourhood ??
      a.road ??
      a.town ??
      a.city ??
      formatCoords(lat, lng)
    );
  } catch {
    return formatCoords(lat, lng);
  }
}

function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Utilitários de desenho PDFKit ─────────────────────────────────────────────
function badge(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  label: string,
  bg: string,
  fg = C.white,
) {
  const w = doc.widthOfString(label) + 14;
  doc.roundedRect(x, y, w, 14, 3).fill(bg);
  doc
    .fontSize(7.5)
    .font("Helvetica-Bold")
    .fillColor(fg)
    .text(label, x + 7, y + 3.5, { lineBreak: false });
}

function riskBadge(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  score: number,
) {
  if (score >= 6) badge(doc, x, y, `CRÍTICO  ${score.toFixed(1)}`, C.danger);
  else if (score >= 3)
    badge(doc, x, y, `ELEVADO  ${score.toFixed(1)}`, C.warning, C.ink);
  else badge(doc, x, y, `BAIXO  ${score.toFixed(1)}`, C.success);
}

function kpiCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  accent: string,
) {
  doc.roundedRect(x, y, w, h, 6).fill(C.surface);
  doc.roundedRect(x, y, 4, h, 2).fill(accent);
  doc
    .fontSize(26)
    .font("Helvetica-Bold")
    .fillColor(accent)
    .text(value, x + 14, y + 10, { width: w - 18, lineBreak: false });
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(label, x + 14, y + h - 18, { width: w - 18, lineBreak: false });
}

// Barra horizontal proporcional
function barH(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  maxW: number,
  h: number,
  value: number,
  maxValue: number,
  color: string,
  label: string,
) {
  const barW = maxValue > 0 ? Math.max((value / maxValue) * maxW, 2) : 2;
  doc.rect(x, y, maxW, h).fill("#f3f4f6");
  doc.roundedRect(x, y, barW, h, 2).fill(color);
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(C.inkSoft)
    .text(label, x - 120, y + 1, {
      width: 115,
      align: "right",
      lineBreak: false,
    });
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .fillColor(C.ink)
    .text(String(value), x + barW + 4, y + 1, { lineBreak: false });
}

// ── Cabeçalho e rodapé ────────────────────────────────────────────────────────
function drawHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle?: string,
  from?: string,
  to?: string,
) {
  // Faixa superior
  doc.rect(0, 0, doc.page.width, 72).fill(C.brand);
  doc.rect(0, 68, doc.page.width, 4).fill(C.warning);

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(C.white)
    .text("AMPARO", 50, 18);
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("rgba(255,255,255,0.7)")
    .text("Sistema de Proteção à Mulher", 50, 40);

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor(C.white)
    .text(title, 0, 16, {
      align: "right",
      width: doc.page.width - 50,
      lineBreak: false,
    });
  if (subtitle) {
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("rgba(255,255,255,0.75)")
      .text(subtitle, 0, 34, {
        align: "right",
        width: doc.page.width - 50,
        lineBreak: false,
      });
  }

  doc.y = 86;
  const gerado = `Gerado em ${new Date().toLocaleString("pt-BR")}`;
  const periodo =
    from || to
      ? ` · Período: ${from ? new Date(from).toLocaleDateString("pt-BR") : "início"} → ${to ? new Date(to).toLocaleDateString("pt-BR") : "hoje"}`
      : "";
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(gerado + periodo, { align: "right" });
  doc.moveDown(0.6);
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.8);
}

function drawFooter(doc: PDFKit.PDFDocument) {
  const bottom = doc.page.height - 38;
  doc
    .moveTo(50, bottom)
    .lineTo(545, bottom)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(
      "Documento gerado automaticamente pelo sistema Amparo · Uso restrito a fins oficiais.",
      50,
      bottom + 8,
      {
        align: "center",
        width: 495,
      },
    );
}

// ── Controller ────────────────────────────────────────────────────────────────
@Controller("reports")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(Role.ADMIN)
export class ReportController {
  constructor(private readonly prisma: PrismaService) {}

  // ── Relatório de Ocorrências ─────────────────────────────────────────────
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

    // KPI derivados
    const total = occurrences.length;
    const withAggressor = occurrences.filter((o) => o.aggressorId).length;
    const last30 = occurrences.filter((o) => {
      const age = Date.now() - new Date(o.createdAt).getTime();
      return age <= 30 * 24 * 60 * 60 * 1000;
    }).length;

    // Tendência mensal (últimos 6 meses)
    const monthlyCounts: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyCounts[
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      ] = 0;
    }
    for (const o of occurrences) {
      const key = `${new Date(o.createdAt).getFullYear()}-${String(new Date(o.createdAt).getMonth() + 1).padStart(2, "0")}`;
      if (key in monthlyCounts) monthlyCounts[key]++;
    }

    const doc: PDFKit.PDFDocument = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-ocorrencias-${Date.now()}.pdf"`,
    );
    doc.pipe(res);

    drawHeader(doc, "Relatório de Ocorrências", undefined, from, to);

    // ── KPI cards ──
    const cardW = 148,
      cardH = 56,
      gap = 10,
      startX = 50;
    kpiCard(
      doc,
      startX,
      doc.y,
      cardW,
      cardH,
      String(total),
      "Total de ocorrências",
      C.primary,
    );
    kpiCard(
      doc,
      startX + cardW + gap,
      doc.y,
      cardW,
      cardH,
      String(withAggressor),
      "Com agressor identificado",
      C.danger,
    );
    kpiCard(
      doc,
      startX + (cardW + gap) * 2,
      doc.y,
      cardW,
      cardH,
      String(last30),
      "Últimos 30 dias",
      C.warning,
    );
    doc.y += cardH + 18;

    // ── Gráfico de tendência mensal ──
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(C.ink)
      .text("Tendência mensal (últimos 6 meses)");
    doc.moveDown(0.4);

    const chartStartY = doc.y;
    const maxCount = Math.max(...Object.values(monthlyCounts), 1);
    const months = Object.entries(monthlyCounts);

    for (const [monthKey, count] of months) {
      const [y, m] = monthKey.split("-");
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
        "pt-BR",
        { month: "short", year: "2-digit" },
      );
      barH(
        doc,
        170,
        doc.y,
        360,
        14,
        count,
        maxCount,
        count === maxCount ? C.danger : C.primary,
        label,
      );
      doc.y += 18;
    }
    doc.y = chartStartY + months.length * 18 + 10;
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor(C.border)
      .lineWidth(0.5)
      .stroke();
    doc.moveDown(1.2);

    // ── Lista de ocorrências ──
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(C.ink)
      .text("Detalhamento");
    doc.moveDown(0.5);

    if (total === 0) {
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(C.muted)
        .text("Nenhuma ocorrência no período selecionado.");
    } else {
      for (let i = 0; i < occurrences.length; i++) {
        const occ = occurrences[i];

        if (doc.y > doc.page.height - 120) {
          doc.addPage();
          doc.y = 50;
        }

        const rowY = doc.y;
        // fundo alternado
        if (i % 2 === 0) doc.rect(50, rowY, 495, 50).fill(C.surface);

        // Número e data
        doc
          .fontSize(8)
          .font("Helvetica-Bold")
          .fillColor(C.muted)
          .text(`#${i + 1}`, 55, rowY + 5, { width: 25, lineBreak: false });
        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor(C.muted)
          .text(
            new Date(occ.createdAt).toLocaleDateString("pt-BR"),
            80,
            rowY + 5,
            { lineBreak: false },
          );

        // Badge de agressor
        if (occ.aggressor) {
          badge(doc, 160, rowY + 4, `⚠ ${occ.aggressor.name}`, C.danger);
        }

        // Descrição
        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(C.inkSoft)
          .text(occ.description, 55, rowY + 19, {
            width: 440,
            lineBreak: false,
          });

        // Coordenadas discretas (apenas referência, sem destaque)
        doc
          .fontSize(7)
          .font("Helvetica")
          .fillColor(C.muted)
          .text(
            `${occ.latitude.toFixed(4)}, ${occ.longitude.toFixed(4)}`,
            55,
            rowY + 36,
            { lineBreak: false },
          );

        doc.y = rowY + 52;
      }
    }

    drawFooter(doc);
    doc.end();
  }

  // ── Análise de risco por área ─────────────────────────────────────────────
  @Get("area-analysis")
  async areaAnalysisReport(@Res() res: Response) {
    const [heatMapCells, totalOccurrences, totalAggressors] = await Promise.all(
      [
        this.prisma.heatMapCell.findMany({
          orderBy: { riskScore: "desc" },
          take: 20,
        }),
        this.prisma.occurrence.count(),
        this.prisma.aggressor.count(),
      ],
    );

    // Geocodificação reversa do Top 5 (1 req/s)
    const geocoded: string[] = [];
    for (let i = 0; i < Math.min(5, heatMapCells.length); i++) {
      const c = heatMapCells[i];
      geocoded.push(await reverseGeocode(c.latitude, c.longitude));
      if (i < 4) await sleep(1100);
    }
    for (let i = 5; i < heatMapCells.length; i++) {
      geocoded.push(
        formatCoords(heatMapCells[i].latitude, heatMapCells[i].longitude),
      );
    }

    const maxScore = heatMapCells[0]?.riskScore ?? 1;
    const totalCells = heatMapCells.length;
    const criticalZones = heatMapCells.filter((c) => c.riskScore >= 6).length;
    const avgScore = heatMapCells.length
      ? heatMapCells.reduce((s, c) => s + c.riskScore, 0) / heatMapCells.length
      : 0;

    const doc: PDFKit.PDFDocument = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-analise-area-${Date.now()}.pdf"`,
    );
    doc.pipe(res);

    drawHeader(
      doc,
      "Análise de Risco por Área",
      "Zonas críticas · heatmap · distribuição geográfica",
    );

    // ── KPI cards ──
    const cardW = 110,
      cardH = 56,
      gap = 10,
      startX = 50;
    kpiCard(
      doc,
      startX,
      doc.y,
      cardW,
      cardH,
      String(totalOccurrences),
      "Ocorrências totais",
      C.primary,
    );
    kpiCard(
      doc,
      startX + cardW + gap,
      doc.y,
      cardW,
      cardH,
      String(totalAggressors),
      "Agressores cadastrados",
      C.danger,
    );
    kpiCard(
      doc,
      startX + (cardW + gap) * 2,
      doc.y,
      cardW,
      cardH,
      String(totalCells),
      "Zonas mapeadas",
      C.warning,
    );
    kpiCard(
      doc,
      startX + (cardW + gap) * 3,
      doc.y,
      cardW,
      cardH,
      String(criticalZones),
      "Zonas críticas",
      C.danger,
    );
    doc.y += cardH + 18;

    // ── Gráfico de barras: Top 10 zonas por score ──
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(C.ink)
      .text("Top 10 zonas por score de risco");
    doc.moveDown(0.4);

    const top10 = heatMapCells.slice(0, 10);
    for (let i = 0; i < top10.length; i++) {
      const c = top10[i];
      const loc =
        i < geocoded.length
          ? geocoded[i]
          : formatCoords(c.latitude, c.longitude);
      const color =
        c.riskScore >= 6 ? C.danger : c.riskScore >= 3 ? C.warning : C.success;
      barH(
        doc,
        200,
        doc.y,
        280,
        13,
        c.riskScore,
        maxScore,
        color,
        `${i + 1}. ${loc.length > 22 ? loc.slice(0, 20) + "…" : loc}`,
      );
      riskBadge(doc, 488, doc.y - 1, c.riskScore);
      doc.y += 18;
    }

    doc
      .moveTo(50, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor(C.border)
      .lineWidth(0.5)
      .stroke();
    doc.moveDown(1.4);

    // ── Tabela completa (sem lat/lng em destaque) ──
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(C.ink)
      .text("Detalhamento completo das zonas");
    doc.moveDown(0.6);

    // Cabeçalho da tabela
    const tTop = doc.y;
    const col = { rank: 55, local: 80, intens: 340, score: 395, date: 450 };
    doc.rect(50, tTop, 495, 16).fill(C.primary);
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor(C.white)
      .text("#", col.rank, tTop + 4, {
        width: 20,
        align: "center",
        lineBreak: false,
      })
      .text("Localidade / Referência", col.local, tTop + 4, {
        width: 255,
        lineBreak: false,
      })
      .text("Ocorr.", col.intens, tTop + 4, {
        width: 50,
        align: "right",
        lineBreak: false,
      })
      .text("Risco", col.score, tTop + 4, {
        width: 50,
        align: "center",
        lineBreak: false,
      })
      .text("Últ. registro", col.date, tTop + 4, {
        width: 90,
        lineBreak: false,
      });

    let rowY = tTop + 18;

    for (let i = 0; i < heatMapCells.length; i++) {
      const cell = heatMapCells[i];
      const loc =
        i < geocoded.length
          ? geocoded[i]
          : formatCoords(cell.latitude, cell.longitude);
      const bg = i % 2 === 0 ? C.surface : C.white;

      if (rowY > doc.page.height - 80) {
        doc.addPage();
        rowY = 60;
      }

      doc.rect(50, rowY, 495, 17).fill(bg);
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(C.ink)
        .text(String(i + 1), col.rank, rowY + 4, {
          width: 20,
          align: "center",
          lineBreak: false,
        })
        .text(
          loc.length > 38 ? loc.slice(0, 36) + "…" : loc,
          col.local,
          rowY + 4,
          { width: 255, lineBreak: false },
        )
        .text(String(cell.intensity), col.intens, rowY + 4, {
          width: 50,
          align: "right",
          lineBreak: false,
        });

      riskBadge(doc, col.score, rowY + 3, cell.riskScore);

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(C.ink)
        .text(
          new Date(cell.lastOccurrence).toLocaleDateString("pt-BR"),
          col.date,
          rowY + 4,
          { width: 90, lineBreak: false },
        );

      rowY += 17;
    }

    doc
      .rect(50, tTop, 495, rowY - tTop)
      .strokeColor(C.border)
      .lineWidth(0.5)
      .stroke();
    doc.y = rowY + 10;

    // ── Nota de rodapé analítica ──
    doc.moveDown(1);
    doc.roundedRect(50, doc.y, 495, 38, 4).fill("#fef3c7");
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor("#92400e")
      .text("Interpretação do Score de Risco", 60, doc.y + 6);
    doc
      .fontSize(7.5)
      .font("Helvetica")
      .fillColor("#78350f")
      .text(
        `Score ≥ 6 (CRÍTICO): requer patrulhamento prioritário.  Score 3–5.9 (ELEVADO): monitoramento regular.  Score < 3 (BAIXO): acompanhamento periódico.  Média atual do mapeamento: ${avgScore.toFixed(2)}.`,
        60,
        doc.y + 16,
        { width: 475, lineBreak: false },
      );
    doc.y += 44;

    drawFooter(doc);
    doc.end();
  }
}
