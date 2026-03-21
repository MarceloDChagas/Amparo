"use client";

/**
 * RN04 — Restrição de Acesso e Sigilo
 * CPF do agressor exibido mascarado por padrão — dado sensível mesmo em tela restrita.
 * NRF01 — LGPD: minimização de exposição de dados pessoais identificáveis.
 */
import { Eye, EyeOff, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Aggressor, aggressorService } from "@/services/aggressor-service";

function MaskedCpf({ cpf, name }: { cpf: string; name: string }) {
  const [revealed, setRevealed] = useState(false);
  const masked = cpf
    ? cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "***.$2.***-**")
    : "—";

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          revealed
            ? "font-semibold text-foreground"
            : "text-muted-foreground tracking-widest",
        )}
      >
        {revealed ? cpf || "—" : masked}
      </span>
      <button
        onClick={() => setRevealed((v) => !v)}
        aria-label={`${revealed ? "Ocultar" : "Revelar"} CPF de ${name}`}
        aria-pressed={revealed}
        className="flex items-center justify-center rounded p-1 transition-colors hover:bg-muted text-muted-foreground"
      >
        {revealed ? (
          <EyeOff size={14} aria-hidden="true" />
        ) : (
          <Eye size={14} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

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
      {/* Stat + ação */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-3 rounded-xl border px-4 py-3 bg-card shadow-sm"
          role="status"
          aria-label={`Total de agressores: ${aggressors.length}`}
          style={{
            borderColor:
              aggressors.length > 0 ? "var(--destructive)" : undefined,
            borderLeft:
              aggressors.length > 0
                ? "3px solid var(--destructive)"
                : undefined,
          }}
        >
          <span
            className="text-2xl font-extrabold tabular-nums"
            style={{
              color:
                aggressors.length > 0
                  ? "var(--destructive)"
                  : "var(--foreground)",
            }}
          >
            {loading ? "—" : aggressors.length}
          </span>
          <span className="text-sm text-muted-foreground">
            agressor{aggressors.length !== 1 ? "es" : ""} cadastrado
            {aggressors.length !== 1 ? "s" : ""}
          </span>
          <span className="ml-2 text-xs font-medium border-l border-border pl-3 text-muted-foreground">
            CPF mascarado por padrão
          </span>
        </div>

        <Link href="/aggressors/create">
          <Button>Novo Agressor</Button>
        </Link>
      </div>

      {loading ? (
        <div
          aria-live="polite"
          aria-busy="true"
          className="animate-pulse text-sm text-muted-foreground"
        >
          Carregando agressores...
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF (mascarado)</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
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
                    <TableCell className="font-medium">
                      {aggressor.name}
                    </TableCell>
                    <TableCell>
                      {/* RN04 — CPF nunca exposto diretamente */}
                      <MaskedCpf cpf={aggressor.cpf} name={aggressor.name} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(aggressor.id)}
                        aria-label={`Excluir agressor ${aggressor.name}`}
                      >
                        <Trash2
                          className="h-4 w-4 text-destructive"
                          aria-hidden="true"
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
