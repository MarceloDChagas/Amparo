"use client";

import { Ban, CheckCircle2, Clock, Siren, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpdateAlertStatus } from "@/data/hooks/use-update-alert-status";
import { AlertStatusType } from "@/services/emergency-alert-service";

import { CancellationModal } from "./CancellationModal";

interface AlertStatusActionsProps {
  alertId: string;
  status: AlertStatusType;
  cancellationReason?: string | null;
  onStatusChange: () => void;
}

const STATUS_CONFIG: Record<
  AlertStatusType,
  {
    label: string;
    icon: React.ReactNode;
    className: string;
  }
> = {
  PENDING: {
    label: "Recebido",
    icon: <Clock size={14} />,
    className: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
  },
  DISPATCHED: {
    label: "Viatura Despachada",
    icon: <Truck size={14} />,
    className: "bg-blue-500/10 text-blue-600 border border-blue-500/30",
  },
  COMPLETED: {
    label: "Concluído",
    icon: <CheckCircle2 size={14} />,
    className:
      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: <XCircle size={14} />,
    className: "bg-muted text-muted-foreground border border-border",
  },
};

export function AlertStatusActions({
  alertId,
  status,
  cancellationReason,
  onStatusChange,
}: AlertStatusActionsProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { mutate, isPending } = useUpdateAlertStatus();

  const config = STATUS_CONFIG[status];

  const handleTransition = (newStatus: AlertStatusType) => {
    mutate(
      { alertId, status: newStatus },
      {
        onSuccess: () => {
          const label = STATUS_CONFIG[newStatus].label;
          toast.success(`Status atualizado para "${label}".`);
          onStatusChange();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erro ao atualizar status.",
          );
        },
      },
    );
  };

  const isTerminal = status === "COMPLETED" || status === "CANCELLED";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Status do alerta
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Motivo do cancelamento, se aplicável */}
      {status === "CANCELLED" && cancellationReason && (
        <div className="rounded-xl bg-muted/50 border border-border p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Motivo do cancelamento
          </p>
          <p className="text-sm text-foreground">{cancellationReason}</p>
        </div>
      )}

      {/* Ações disponíveis conforme status atual */}
      {!isTerminal && (
        <div className="flex flex-col gap-2">
          {status === "PENDING" && (
            <Button
              onClick={() => handleTransition("DISPATCHED")}
              disabled={isPending}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Siren size={16} />
              {isPending ? "Atualizando..." : "Despachar viatura"}
            </Button>
          )}

          {status === "DISPATCHED" && (
            <Button
              onClick={() => handleTransition("COMPLETED")}
              disabled={isPending}
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 size={16} />
              {isPending ? "Atualizando..." : "Marcar como concluído"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setCancelOpen(true)}
            disabled={isPending}
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
          >
            <Ban size={16} />
            Cancelar alerta
          </Button>
        </div>
      )}

      {isTerminal && (
        <p className="text-xs text-muted-foreground text-center">
          Este alerta foi finalizado e não permite mais alterações.
        </p>
      )}

      <CancellationModal
        alertId={alertId}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={onStatusChange}
      />
    </div>
  );
}
