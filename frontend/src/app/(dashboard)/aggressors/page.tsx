"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { govTheme } from "@/components/landing/gov-theme";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Aggressor, aggressorService } from "@/services/aggressor-service";

export default function AggressorsPage() {
  const [aggressors, setAggressors] = useState<Aggressor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAggressors();
  }, []);

  async function loadAggressors() {
    try {
      const data = await aggressorService.getAll();
      setAggressors(data);
    } catch (error) {
      toast.error("Erro ao carregar agressores.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este agressor?")) return;

    try {
      await aggressorService.delete(id);
      toast.success("Agressor excluído com sucesso.");
      loadAggressors();
    } catch (error) {
      toast.error("Erro ao excluir agressor.");
      console.error(error);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: govTheme.text.primary }}
        >
          Agressores
        </h2>
        <Link href="/aggressors/create">
          <Button>Novo Agressor</Button>
        </Link>
      </div>
      <p style={{ color: govTheme.text.secondary }}>
        Listagem de agressores cadastrados.
      </p>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div
          className="rounded-2xl border"
          style={{
            borderColor: govTheme.border.subtle,
            backgroundColor: govTheme.background.section,
            boxShadow: govTheme.shadow.card,
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggressors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    Nenhum agressor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                aggressors.map((aggressor) => (
                  <TableRow key={aggressor.id}>
                    <TableCell>{aggressor.name}</TableCell>
                    <TableCell>{aggressor.cpf}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(aggressor.id)}
                      >
                        <Trash2
                          className="h-4 w-4"
                          style={{ color: govTheme.status.danger }}
                        />
                      </Button>
                    </TableCell>
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
