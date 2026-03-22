"use client";

import { Flame, List, Map } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Occurrence, occurrenceService } from "@/services/occurrence-service";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOccurrences();
  }, []);

  async function loadOccurrences() {
    try {
      const data = await occurrenceService.getAll();
      setOccurrences(data);
    } catch (error) {
      toast.error("Erro ao carregar ocorrências.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
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

        <Link href="/occurrences/create">
          <Button>Nova Ocorrência</Button>
        </Link>
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
                    <TableHead>ID do Usuário</TableHead>
                    <TableHead>ID do Agressor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occurrences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        Nenhuma ocorrência encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    occurrences.map((occurrence) => (
                      <TableRow key={occurrence.id}>
                        <TableCell>{occurrence.description}</TableCell>
                        <TableCell>
                          {occurrence.latitude}, {occurrence.longitude}
                        </TableCell>
                        <TableCell>{occurrence.userId}</TableCell>
                        <TableCell>{occurrence.aggressorId}</TableCell>
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
            <OccurrencesMap occurrences={occurrences} viewMode="heatmap" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
