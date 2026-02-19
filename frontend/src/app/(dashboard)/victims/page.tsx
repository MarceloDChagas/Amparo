"use client";

import { Trash2 } from "lucide-react";
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
import { Victim, victimService } from "@/services/victim-service";

export default function VictimsPage() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVictims();
  }, []);

  async function loadVictims() {
    try {
      const data = await victimService.getAll();
      setVictims(data);
    } catch (error) {
      toast.error("Erro ao carregar vítimas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta vítima?")) return;

    try {
      await victimService.delete(id);
      toast.success("Vítima excluída com sucesso.");
      loadVictims();
    } catch (error) {
      toast.error("Erro ao excluir vítima.");
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vítimas</h2>
        <Link href="/victims/create">
          <Button>Nova Vítima</Button>
        </Link>
      </div>
      <p className="text-muted-foreground">Listagem de vítimas cadastradas.</p>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {victims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    Nenhuma vítima encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                victims.map((victim) => (
                  <TableRow key={victim.id}>
                    <TableCell>{victim.name}</TableCell>
                    <TableCell>{victim.cpf}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(victim.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
