"use client";

import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { User, userService } from "@/services/user-service";

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
      <div className="flex justify-between items-center">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: govTheme.text.primary }}
        >
          Usuários
        </h2>
      </div>
      <p style={{ color: govTheme.text.secondary }}>
        Listagem de usuários cadastrados.
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
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Detalhes
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
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
