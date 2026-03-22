"use client";

/**
 * RN04 — Restrição de Acesso e Sigilo
 * CPF exibido mascarado por padrão para todos os operadores.
 * O botão "revelar" expõe o dado completo sob demanda, com feedback visual claro
 * entre estado mascarado (muted + mono) e revelado (semibold + foreground).
 *
 * RF05 — Banco de Dados Unificado: lista todos os usuários cadastrados.
 * RF15 — Direito ao Esquecimento: botão de exclusão disponível para Admin.
 * NRF01 — LGPD: minimização de exposição de dados pessoais identificáveis.
 * NRF10 — Acessibilidade: aria-label dinâmico no botão de revelar CPF.
 */
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { User, userService } from "@/services/user-service";

/**
 * RN04 — Mascaramento de dado sensível com controle explícito de revelação.
 * Diferença visual entre estado mascarado e revelado via tipografia (NRF10).
 */
function MaskedCpf({ cpf, userName }: { cpf: string; userName: string }) {
  const [revealed, setRevealed] = useState(false);

  const masked = cpf
    ? cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "***.$2.***-**")
    : "—";

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          // NRF10 — diferença tipográfica entre dado mascarado e revelado
          revealed
            ? "font-semibold text-foreground"
            : "text-muted-foreground tracking-widest",
        )}
      >
        {revealed ? cpf || "—" : masked}
      </span>
      <button
        onClick={() => setRevealed((v) => !v)}
        // NRF10 — label descreve exatamente o que o botão faz e para quem
        aria-label={`${revealed ? "Ocultar" : "Revelar"} CPF de ${userName}`}
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

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await userService.delete(id);
      toast.success("Usuário excluído com sucesso.");
      loadUsers();
    } catch (error) {
      toast.error("Erro ao excluir usuário.");
      console.error(error);
    }
  }

  return (
    <div className="space-y-5">
      {/* Stat — total de usuários */}
      <div
        className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-3 bg-card shadow-sm"
        role="status"
        aria-label={`Total de usuários: ${users.length}`}
      >
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {loading ? "—" : users.length}
        </span>
        <span className="text-sm text-muted-foreground">
          usuário{users.length !== 1 ? "s" : ""} cadastrado
          {users.length !== 1 ? "s" : ""}
        </span>
        {/* RN04 — aviso sobre mascaramento */}
        <span className="ml-2 text-xs font-medium border-l border-border pl-3 text-muted-foreground">
          CPF mascarado por padrão
        </span>
      </div>

      {loading ? (
        <div
          aria-live="polite"
          aria-busy="true"
          className="animate-pulse text-sm text-muted-foreground"
        >
          Carregando usuários...
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                {/* RN04 — label explicita que o dado é sensível e mascarado */}
                <TableHead>CPF (mascarado)</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {/* RN04 — CPF nunca exposto diretamente na tabela */}
                      <MaskedCpf cpf={user.cpf} userName={user.name} />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/users/${user.id}`)}
                        aria-label={`Ver detalhes de ${user.name}`}
                      >
                        <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                        Detalhes
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        aria-label={`Excluir usuário ${user.name}`}
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
