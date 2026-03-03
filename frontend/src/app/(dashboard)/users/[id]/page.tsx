"use client";

import { ArrowLeft, UserCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DocumentsSection } from "@/components/documents/DocumentsSection";
import { NotesSection } from "@/components/notes/NotesSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, userService } from "@/services/user-service";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    void loadUserDetails();
  }, [userId]);

  async function loadUserDetails() {
    try {
      const data = await userService.getById(userId);
      setUser(data);
    } catch (error) {
      toast.error("Erro ao carregar detalhes do usuário.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 font-medium">Carregando dados do usuário...</div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
        <Button variant="outline" onClick={() => router.push("/users")}>
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/users")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Detalhes do Usuário
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <UserCircle2 className="h-10 w-10 text-muted-foreground" />
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-sm text-muted-foreground">CPF</p>
              <p>{user.cpf ?? "Não informado"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <div className="lg:col-span-1">
          <NotesSection userId={user.id} />
        </div>

        {/* Documents Section */}
        <div className="lg:col-span-1">
          <DocumentsSection userId={user.id} />
        </div>
      </div>
    </div>
  );
}
