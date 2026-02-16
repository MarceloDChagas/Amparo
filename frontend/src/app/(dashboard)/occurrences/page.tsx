"use client";

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
import { Occurrence, occurrenceService } from "@/services/occurrence-service";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Ocorrências</h2>
        <Link href="/occurrences/create">
          <Button>Nova Ocorrência</Button>
        </Link>
      </div>
      <p className="text-muted-foreground">
        Listagem de ocorrências registradas.
      </p>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>ID da Vítima</TableHead>
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
                    <TableCell>{occurrence.victimId}</TableCell>
                    <TableCell>{occurrence.aggressorId}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
