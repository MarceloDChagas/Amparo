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

const PAGE_W = 595.28; // A4
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2; // 495

// ── Geocodificação reversa ────────────────────────────────────────────────────
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Amparo-Report/1.0 (sistema de proteção à mulher)",
      },
    });
    if (!r.ok) return fmtCoord(lat, lng);
    const d = (await r.json()) as {
      address?: {
        suburb?: string;
        neighbourhood?: string;
        road?: string;
        town?: string;
        city?: string;
      };
    };
    const a = d.address ?? {};
    return (
      a.suburb ??
      a.neighbourhood ??
      a.road ??
      a.town ??
      a.city ??
      fmtCoord(lat, lng)
    );
  } catch {
    return fmtCoord(lat, lng);
  }
}

function fmtCoord(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Primitivas de desenho — todas retornam o novo y ──────────────────────────

/** Faixa de cabeçalho. Retorna y logo abaixo do cabeçalho. */
function drawHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle?: string,
  from?: string,
  to?: string,
): number {
  const H = 72;
  doc.rect(0, 0, PAGE_W, H).fill(C.brand);
  doc.rect(0, H - 4, PAGE_W, 4).fill(C.warning);

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(C.white)
    .text("AMPARO", MARGIN, 18);
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("rgba(255,255,255,0.7)")
    .text("Sistema de Proteção à Mulher", MARGIN, 40);

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor(C.white)
    .text(title, MARGIN, 16, {
      align: "right",
      width: CONTENT_W,
      lineBreak: false,
    });
  if (subtitle) {
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("rgba(255,255,255,0.75)")
      .text(subtitle, MARGIN, 34, {
        align: "right",
        width: CONTENT_W,
        lineBreak: false,
      });
  }

  let y = H + 10;
  const meta =
    `Gerado em ${new Date().toLocaleString("pt-BR")}` +
    (from || to
      ? ` · Período: ${from ? new Date(from).toLocaleDateString("pt-BR") : "início"} → ${to ? new Date(to).toLocaleDateString("pt-BR") : "hoje"}`
      : "");
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(meta, MARGIN, y, { align: "right", width: CONTENT_W });
  y += 14;
  doc
    .moveTo(MARGIN, y)
    .lineTo(MARGIN + CONTENT_W, y)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
  return y + 12;
}

function drawFooter(doc: PDFKit.PDFDocument) {
  const bottom = doc.page.height - 36;
  doc
    .moveTo(MARGIN, bottom)
    .lineTo(MARGIN + CONTENT_W, bottom)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(
      "Documento gerado automaticamente pelo sistema Amparo · Uso restrito a fins oficiais.",
      MARGIN,
      bottom + 8,
      { align: "center", width: CONTENT_W, lineBreak: false },
    );
  // Impede o PDFKit de criar uma página extra por overflow após o footer
  doc.y = MARGIN;
}

/** KPI card. Retorna x + w (para encadear side-by-side). */
function kpiCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  accent: string,
): void {
  doc.roundedRect(x, y, w, h, 5).fill(C.surface);
  doc.rect(x, y, 4, h).fill(accent); // barra lateral
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor(accent)
    .text(value, x + 12, y + 8, { width: w - 16, lineBreak: false });
  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor(C.muted)
    .text(label, x + 12, y + h - 16, { width: w - 16, lineBreak: false });
}

/** Barra horizontal. Retorna y + rowH. */
function barRow(
  doc: PDFKit.PDFDocument,
  y: number,
  label: string,
  value: number,
  maxValue: number,
  barColor: string,
  labelW = 130,
  barX = MARGIN + 135,
  barMaxW = 290,
  rowH = 16,
): number {
  const barW = maxValue > 0 ? Math.max((value / maxValue) * barMaxW, 3) : 3;
  const barY = y + (rowH - 10) / 2;

  // label à esquerda
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(C.inkSoft)
    .text(label, MARGIN, y + 2, { width: labelW, lineBreak: false });
  // trilho cinza
  doc.roundedRect(barX, barY, barMaxW, 10, 2).fill("#e5e7eb");
  // barra colorida
  doc.roundedRect(barX, barY, barW, 10, 2).fill(barColor);
  // valor à direita
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .fillColor(C.ink)
    .text(String(value), barX + barMaxW + 6, y + 2, { lineBreak: false });

  return y + rowH + 2;
}

/** Badge colorido. Retorna largura do badge. */
function badge(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  label: string,
  bg: string,
  fg = C.white,
): number {
  doc.fontSize(7.5).font("Helvetica-Bold");
  const w = doc.widthOfString(label) + 12;
  doc.roundedRect(x, y, w, 13, 3).fill(bg);
  doc.fillColor(fg).text(label, x + 6, y + 2.5, { lineBreak: false });
  return w;
}

function riskBadge(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  score: number,
): void {
  if (score >= 6) badge(doc, x, y, `CRÍTICO  ${score.toFixed(1)}`, C.danger);
  else if (score >= 3)
    badge(doc, x, y, `ELEVADO  ${score.toFixed(1)}`, C.warning, C.ink);
  else badge(doc, x, y, `BAIXO  ${score.toFixed(1)}`, C.success);
}

function sectionTitle(
  doc: PDFKit.PDFDocument,
  y: number,
  text: string,
): number {
  doc.rect(MARGIN, y, CONTENT_W, 20).fill(C.primary);
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(C.white)
    .text(text, MARGIN + 8, y + 5, { width: CONTENT_W - 16, lineBreak: false });
  return y + 20 + 6;
}

// ── Controller ────────────────────────────────────────────────────────────────
@Controller("reports")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(Role.ADMIN)
export class ReportController {
  constructor(private readonly prisma: PrismaService) {}

  // ── Relatório de Ocorrências ────────────────────────────────────────────────
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

    const total = occurrences.length;
    const withAggressor = occurrences.filter((o) => o.aggressorId).length;
    const last30 = occurrences.filter((o) => {
      return (
        Date.now() - new Date(o.createdAt).getTime() <= 30 * 24 * 3600 * 1000
      );
    }).length;

    // Tendência mensal — últimos 6 meses
    const monthMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      monthMap[
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      ] = 0;
    }
    for (const o of occurrences) {
      const d = new Date(o.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (k in monthMap) monthMap[k]++;
    }

    const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-ocorrencias-${Date.now()}.pdf"`,
    );
    doc.pipe(res);

    let y = drawHeader(doc, "Relatório de Ocorrências", undefined, from, to);

    // ── KPI cards ──────────────────────────────────────────────────────────
    const cw = 150,
      ch = 54,
      gap = 10;
    kpiCard(
      doc,
      MARGIN,
      y,
      cw,
      ch,
      String(total),
      "Total de ocorrências",
      C.primary,
    );
    kpiCard(
      doc,
      MARGIN + cw + gap,
      y,
      cw,
      ch,
      String(withAggressor),
      "Com agressor identificado",
      C.danger,
    );
    kpiCard(
      doc,
      MARGIN + (cw + gap) * 2,
      y,
      cw,
      ch,
      String(last30),
      "Últimos 30 dias",
      C.warning,
    );
    y += ch + 16;

    // ── Tendência mensal ───────────────────────────────────────────────────
    y = sectionTitle(doc, y, "Tendência mensal — últimos 6 meses");
    const maxMonth = Math.max(...Object.values(monthMap), 1);
    for (const [key, count] of Object.entries(monthMap)) {
      const [yr, mo] = key.split("-");
      const label = new Date(Number(yr), Number(mo) - 1, 1).toLocaleDateString(
        "pt-BR",
        { month: "short", year: "2-digit" },
      );
      const color = count === maxMonth && count > 0 ? C.danger : C.primary;
      y = barRow(doc, y, label, count, maxMonth, color, 60, MARGIN + 65, 350);
    }
    y += 10;

    // ── Lista de ocorrências ───────────────────────────────────────────────
    y = sectionTitle(doc, y, "Detalhamento das ocorrências");

    if (total === 0) {
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(C.muted)
        .text("Nenhuma ocorrência no período.", MARGIN, y);
      y += 20;
    } else {
      const ROW = 46;
      for (let i = 0; i < occurrences.length; i++) {
        if (y + ROW > doc.page.height - 60) {
          drawFooter(doc);
          doc.addPage();
          y = MARGIN;
        }
        const occ = occurrences[i];
        const bg = i % 2 === 0 ? C.surface : C.white;
        doc.rect(MARGIN, y, CONTENT_W, ROW).fill(bg);

        // Índice + data
        doc
          .fontSize(8)
          .font("Helvetica-Bold")
          .fillColor(C.muted)
          .text(`#${i + 1}`, MARGIN + 4, y + 4, {
            width: 22,
            lineBreak: false,
          });
        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor(C.muted)
          .text(
            new Date(occ.createdAt).toLocaleDateString("pt-BR"),
            MARGIN + 28,
            y + 4,
            { lineBreak: false },
          );

        // Badge de agressor
        if (occ.aggressor) {
          badge(doc, MARGIN + 110, y + 3, `⚠ ${occ.aggressor.name}`, C.danger);
        }

        // Descrição
        doc
          .fontSize(8.5)
          .font("Helvetica")
          .fillColor(C.inkSoft)
          .text(occ.description, MARGIN + 4, y + 18, {
            width: CONTENT_W - 8,
            lineBreak: false,
          });

        // Coordenadas discretas
        doc
          .fontSize(7)
          .font("Helvetica")
          .fillColor(C.muted)
          .text(
            `${occ.latitude.toFixed(4)}, ${occ.longitude.toFixed(4)}`,
            MARGIN + 4,
            y + 33,
            { lineBreak: false },
          );

        // Linha separadora
        doc
          .moveTo(MARGIN, y + ROW)
          .lineTo(MARGIN + CONTENT_W, y + ROW)
          .strokeColor(C.border)
          .lineWidth(0.4)
          .stroke();
        y += ROW;
      }
    }

    drawFooter(doc);
    doc.end();
  }

  // ── Análise de risco por área ───────────────────────────────────────────────
  @Get("area-analysis")
  async areaAnalysisReport(@Res() res: Response) {
    const [cells, totalOcc, totalAgg] = await Promise.all([
      this.prisma.heatMapCell.findMany({
        orderBy: { riskScore: "desc" },
        take: 20,
      }),
      this.prisma.occurrence.count(),
      this.prisma.aggressor.count(),
    ]);

    // Geocodificação reversa — Top 5 apenas (1 req/s)
    const geo: string[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (i < 5) {
        geo.push(await reverseGeocode(cells[i].latitude, cells[i].longitude));
        if (i < 4) await sleep(1100);
      } else {
        geo.push(fmtCoord(cells[i].latitude, cells[i].longitude));
      }
    }

    const maxScore = cells[0]?.riskScore ?? 1;
    const critical = cells.filter((c) => c.riskScore >= 6).length;
    const avgScore = cells.length
      ? cells.reduce((s, c) => s + c.riskScore, 0) / cells.length
      : 0;

    const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-analise-area-${Date.now()}.pdf"`,
    );
    doc.pipe(res);

    let y = drawHeader(
      doc,
      "Análise de Risco por Área",
      "Zonas críticas · distribuição geográfica",
    );

    // ── KPI cards ──────────────────────────────────────────────────────────
    const cw = 110,
      ch = 54,
      gap = 9;
    kpiCard(
      doc,
      MARGIN,
      y,
      cw,
      ch,
      String(totalOcc),
      "Ocorrências totais",
      C.primary,
    );
    kpiCard(
      doc,
      MARGIN + cw + gap,
      y,
      cw,
      ch,
      String(totalAgg),
      "Agressores",
      C.danger,
    );
    kpiCard(
      doc,
      MARGIN + (cw + gap) * 2,
      y,
      cw,
      ch,
      String(cells.length),
      "Zonas mapeadas",
      C.warning,
    );
    kpiCard(
      doc,
      MARGIN + (cw + gap) * 3,
      y,
      cw,
      ch,
      String(critical),
      "Zonas críticas",
      C.danger,
    );
    y += ch + 16;

    // ── Gráfico Top 10 ─────────────────────────────────────────────────────
    y = sectionTitle(doc, y, "Top 10 zonas por score de risco");
    const top10 = cells.slice(0, 10);
    for (let i = 0; i < top10.length; i++) {
      const c = top10[i];
      const loc = geo[i] ?? fmtCoord(c.latitude, c.longitude);
      const label = `${i + 1}. ${loc.length > 24 ? loc.slice(0, 22) + "…" : loc}`;
      const color =
        c.riskScore >= 6 ? C.danger : c.riskScore >= 3 ? C.warning : C.success;
      y = barRow(
        doc,
        y,
        label,
        c.riskScore,
        maxScore,
        color,
        155,
        MARGIN + 160,
        260,
        17,
      );
      // badge de risco à direita da barra
      riskBadge(doc, MARGIN + 160 + 260 + 20, y - 15, c.riskScore);
    }
    y += 10;

    // ── Tabela completa ────────────────────────────────────────────────────
    y = sectionTitle(doc, y, "Detalhamento completo das zonas");

    // Cabeçalho da tabela
    const col = {
      rank: MARGIN + 4,
      local: MARGIN + 28,
      intens: MARGIN + 330,
      score: MARGIN + 375,
      date: MARGIN + 435,
    };
    doc.rect(MARGIN, y, CONTENT_W, 16).fill("#374151");
    doc
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .fillColor(C.white)
      .text("#", col.rank, y + 4, { width: 20, lineBreak: false })
      .text("Localidade / Referência", col.local, y + 4, {
        width: 298,
        lineBreak: false,
      })
      .text("Ocorr.", col.intens, y + 4, {
        width: 40,
        align: "right",
        lineBreak: false,
      })
      .text("Risco", col.score, y + 4, {
        width: 55,
        align: "center",
        lineBreak: false,
      })
      .text("Últ. registro", col.date, y + 4, { width: 60, lineBreak: false });
    y += 16;

    for (let i = 0; i < cells.length; i++) {
      if (y + 16 > doc.page.height - 60) {
        drawFooter(doc);
        doc.addPage();
        y = MARGIN;
      }
      const c = cells[i];
      const loc = geo[i] ?? fmtCoord(c.latitude, c.longitude);
      const bg = i % 2 === 0 ? C.surface : C.white;

      doc.rect(MARGIN, y, CONTENT_W, 16).fill(bg);
      doc
        .fontSize(7.5)
        .font("Helvetica")
        .fillColor(C.ink)
        .text(String(i + 1), col.rank, y + 3.5, { width: 20, lineBreak: false })
        .text(
          loc.length > 44 ? loc.slice(0, 42) + "…" : loc,
          col.local,
          y + 3.5,
          { width: 298, lineBreak: false },
        )
        .text(String(c.intensity), col.intens, y + 3.5, {
          width: 40,
          align: "right",
          lineBreak: false,
        });

      riskBadge(doc, col.score - 2, y + 2, c.riskScore);

      doc
        .fontSize(7.5)
        .font("Helvetica")
        .fillColor(C.ink)
        .text(
          new Date(c.lastOccurrence).toLocaleDateString("pt-BR"),
          col.date,
          y + 3.5,
          { width: 60, lineBreak: false },
        );

      doc
        .moveTo(MARGIN, y + 16)
        .lineTo(MARGIN + CONTENT_W, y + 16)
        .strokeColor(C.border)
        .lineWidth(0.3)
        .stroke();
      y += 16;
    }
    y += 12;

    // ── Nota interpretativa ────────────────────────────────────────────────
    if (y + 40 > doc.page.height - 60) {
      drawFooter(doc);
      doc.addPage();
      y = MARGIN;
    }
    doc.roundedRect(MARGIN, y, CONTENT_W, 36, 4).fill("#fef3c7");
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor("#92400e")
      .text("Interpretação do Score de Risco", MARGIN + 8, y + 6, {
        lineBreak: false,
      });
    doc
      .fontSize(7.5)
      .font("Helvetica")
      .fillColor("#78350f")
      .text(
        `Score ≥ 6 (CRÍTICO): patrulhamento prioritário.  Score 3–5,9 (ELEVADO): monitoramento regular.  Score < 3 (BAIXO): acompanhamento periódico.  Média atual: ${avgScore.toFixed(2)}.`,
        MARGIN + 8,
        y + 18,
        { width: CONTENT_W - 16, lineBreak: false },
      );

    drawFooter(doc);
    doc.end();
  }
}
