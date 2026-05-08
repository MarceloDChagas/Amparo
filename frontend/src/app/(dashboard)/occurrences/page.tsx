"use client";

import { FileDown, Flame, List, Map } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistedFilters } from "@/hooks/use-persisted-filters";
import { HeatMapCell, heatMapService } from "@/services/heat-map-service";
import { Occurrence, occurrenceService } from "@/services/occurrence-service";
import { reportService } from "@/services/report-service";

const OccurrencesMap = dynamic(
  () => import("@/presentation/components/map/occurrences-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center rounded-md border text-muted-foreground">
        Carregando mapa...
      </div>
    ),
  },
);

export default function OccurrencesPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [heatMapCells, setHeatMapCells] = useState<HeatMapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingOcc, setExportingOcc] = useState(false);
  const [exportingArea, setExportingArea] = useState(false);
  // ⑰ — filtros persistidos
  const { filters, setFilters } = usePersistedFilters(
    "amparo:filters:occurrences",
    {
      period: "24h",
      status: "all",
    },
  );

  const filteredOccurrences = useMemo(() => {
    const now = Date.now();
    const cutoff =
      filters.period === "24h"
        ? now - 24 * 60 * 60 * 1000
        : filters.period === "7d"
          ? now - 7 * 24 * 60 * 60 * 1000
          : 0;
    return occurrences.filter((o) => {
      return cutoff === 0 || new Date(o.createdAt ?? "").getTime() >= cutoff;
    });
  }, [occurrences, filters.period]);

  useEffect(() => {
    loadData();
  }, []);

  async function handleExportOccurrences() {
    setExportingOcc(true);
    try {
      await reportService.downloadOccurrencesReport();
      toast.success("Relatório de ocorrências gerado.");
    } catch {
      toast.error("Erro ao gerar relatório.");
    } finally {
      setExportingOcc(false);
    }
  }

  async function handleExportAreaAnalysis() {
    setExportingArea(true);
    try {
      await reportService.downloadAreaAnalysisReport();
      toast.success("Relatório de análise de área gerado.");
    } catch {
      toast.error("Erro ao gerar relatório.");
    } finally {
      setExportingArea(false);
    }
  }

  async function loadData() {
    try {
      const [occ, cells] = await Promise.all([
        occurrenceService.getAll(),
        heatMapService.getAll().catch(() => [] as HeatMapCell[]),
      ]);
      setOccurrences(occ);
      setHeatMapCells(cells);
    } catch (error) {
      toast.error("Erro ao carregar ocorrências.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const periodOptions = [
    { value: "24h", label: "Últimas 24h" },
    { value: "7d", label: "7 dias" },
    { value: "all", label: "Todos" },
  ] as const;

  return (
    <div className="space-y-5">
      {/* ⑰ — Filtros persistidos */}
      <div className="flex flex-wrap gap-2">
        {periodOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => setFilters({ period: o.value })}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            style={{
              borderColor:
                filters.period === o.value ? "var(--primary)" : "var(--border)",
              backgroundColor:
                filters.period === o.value ? "var(--primary)" : "transparent",
              color:
                filters.period === o.value
                  ? "white"
                  : "var(--muted-foreground)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Stat + ação */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-3 bg-card shadow-sm"
          role="status"
          aria-label={`Total de ocorrências: ${occurrences.length}`}
        >
          <span className="text-2xl font-extrabold tabular-nums text-foreground">
            {loading ? "—" : occurrences.length}
          </span>
          <span className="text-sm text-muted-foreground">
            ocorrência{occurrences.length !== 1 ? "s" : ""} registrada
            {occurrences.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* RF16 — Relatórios Oficiais */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAreaAnalysis}
            disabled={exportingArea}
            className="flex items-center gap-1.5"
          >
            <FileDown className="h-4 w-4" />
            {exportingArea ? "Gerando..." : "Análise de Área"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportOccurrences}
            disabled={exportingOcc}
            className="flex items-center gap-1.5"
          >
            <FileDown className="h-4 w-4" />
            {exportingOcc ? "Gerando..." : "Exportar PDF"}
          </Button>
          <Link href="/occurrences/create">
            <Button>Nova Ocorrência</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div
          aria-live="polite"
          aria-busy="true"
          className="animate-pulse text-sm text-muted-foreground"
        >
          Carregando ocorrências...
        </div>
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Tabela
            </TabsTrigger>
            <TabsTrigger value="cluster" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Calor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>ID do Usuário</TableHead>
                    <TableHead>ID do Agressor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOccurrences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Nenhuma ocorrência encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOccurrences.map((occurrence) => (
                      <TableRow key={occurrence.id}>
                        <TableCell>{occurrence.description}</TableCell>
                        <TableCell>
                          {occurrence.latitude}, {occurrence.longitude}
                        </TableCell>
                        <TableCell>
                          {occurrence.createdAt
                            ? new Date(occurrence.createdAt).toLocaleDateString(
                                "pt-BR",
                              )
                            : "—"}
                        </TableCell>
                        <TableCell>{occurrence.userId}</TableCell>
                        <TableCell>{occurrence.aggressorId ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="cluster" className="mt-4">
            <OccurrencesMap occurrences={occurrences} viewMode="cluster" />
          </TabsContent>
          <TabsContent value="heatmap" className="mt-4">
            <OccurrencesMap
              occurrences={occurrences}
              viewMode="heatmap"
              heatMapCells={heatMapCells}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
