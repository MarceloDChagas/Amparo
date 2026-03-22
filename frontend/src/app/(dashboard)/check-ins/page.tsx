"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  RefreshCw,
  ShieldAlert,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { CheckIn, checkInService } from "@/services/check-in-service";

// ── Estágios de escalonamento ────────────────────────────────────────────────
const STAGE_LABELS: Record<
  number,
  { label: string; color: string; icon: React.ReactNode }
> = {
  0: {
    label: "Detectado",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  1: {
    label: "Notificado (in-app)",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  2: {
    label: "E-mail P1 enviado",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: <Mail className="h-3.5 w-3.5" />,
  },
  3: {
    label: "E-mail P2/P3 enviado",
    color: "text-red-700 bg-red-100 border-red-300",
    icon: <Mail className="h-3.5 w-3.5" />,
  },
  4: {
    label: "Alerta crítico gerado",
    color: "text-white bg-red-600 border-red-700",
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
  },
};

// ── Barra de progresso do escalonamento ──────────────────────────────────────
function EscalationProgress({ stage }: { stage: number }) {
  const steps = ["+5min", "+15min", "+30min", "+45min"];
  return (
    <div className="flex items-center gap-1 mt-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`h-2 w-8 rounded-full transition-colors ${
              i < stage ? "bg-red-500" : "bg-gray-200"
            }`}
            title={label}
          />
          {i < steps.length - 1 && (
            <div className="text-gray-300 text-xs">›</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Card de um check-in atrasado ─────────────────────────────────────────────
function LateCheckInCard({
  checkIn,
  onClose,
  onEscalate,
}: {
  checkIn: CheckIn;
  onClose: (id: string) => void;
  onEscalate: (id: string) => void;
}) {
  const stage = checkIn.escalationStage ?? 0;
  const stageInfo = STAGE_LABELS[stage] ?? STAGE_LABELS[4];

  const overdueLabel = checkIn.overdueAt
    ? formatDistanceToNow(new Date(checkIn.overdueAt), {
        addSuffix: true,
        locale: ptBR,
      })
    : "há alguns instantes";

  const expectedLabel = new Date(
    checkIn.expectedArrivalTime,
  ).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-[16px] border border-border bg-card p-5 shadow-sm space-y-3">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground text-sm">
            {checkIn.user?.name ?? `Usuário ${checkIn.userId.slice(0, 8)}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Previsto para às {expectedLabel} · atrasado {overdueLabel}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${stageInfo.color}`}
        >
          {stageInfo.icon}
          {stageInfo.label}
        </span>
      </div>

      {/* Barra de progresso */}
      <EscalationProgress stage={stage} />

      {/* Ações */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onEscalate(checkIn.id)}
          disabled={stage >= 4}
          className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-3.5 w-3.5" />
          Escalar agora
        </button>
        <button
          onClick={() => onClose(checkIn.id)}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Encerrar
        </button>
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function LateCheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await checkInService.getAllLate();
      setCheckIns(data);
    } catch {
      toast.error("Erro ao carregar deslocamentos em atraso.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleClose = async (id: string) => {
    try {
      await checkInService.close(id);
      toast.success("Deslocamento encerrado.");
      setCheckIns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Erro ao encerrar deslocamento.");
    }
  };

  const handleEscalate = async (id: string) => {
    try {
      const updated = await checkInService.escalate(id);
      toast.success("Escalonamento avançado manualmente.");
      setCheckIns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, escalationStage: updated.escalationStage } : c,
        ),
      );
    } catch {
      toast.error("Erro ao escalar deslocamento.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Deslocamentos em Atraso
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Usuários que não confirmaram a chegada dentro do prazo informado.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </button>
      </div>

      {/* Legenda dos estágios */}
      <div className="rounded-[14px] border border-border bg-secondary p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Estágios de escalonamento automático (RN03)
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { time: "+5 min", desc: "Notificação in-app ao usuário" },
            { time: "+15 min", desc: "E-mail ao contato prioridade 1" },
            { time: "+30 min", desc: "E-mail contatos prioridade 2 e 3" },
            { time: "+45 min", desc: "Alerta crítico no dashboard" },
          ].map((step) => (
            <div key={step.time} className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-foreground">
                {step.time}
              </span>
              <span className="text-xs text-muted-foreground">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Carregando...
        </div>
      ) : checkIns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-border bg-card py-16 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-400 mb-3" />
          <p className="font-semibold text-foreground">
            Nenhum atraso registrado
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Todos os deslocamentos ativos estão dentro do prazo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {checkIns.map((c) => (
            <LateCheckInCard
              key={c.id}
              checkIn={c}
              onClose={handleClose}
              onEscalate={handleEscalate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
