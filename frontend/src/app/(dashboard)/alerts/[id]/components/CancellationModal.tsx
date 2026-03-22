"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAlertStatus } from "@/data/hooks/use-update-alert-status";

const cancellationSchema = z.object({
  reason: z
    .string()
    .min(5, "O motivo deve ter ao menos 5 caracteres.")
    .max(500),
});

type CancellationForm = z.infer<typeof cancellationSchema>;

interface CancellationModalProps {
  alertId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CancellationModal({
  alertId,
  open,
  onOpenChange,
  onSuccess,
}: CancellationModalProps) {
  const { mutate, isPending } = useUpdateAlertStatus();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancellationForm>({
    resolver: zodResolver(cancellationSchema),
  });

  const onSubmit = (data: CancellationForm) => {
    mutate(
      {
        alertId,
        status: "CANCELLED",
        cancellationReason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success("Alerta cancelado com sucesso.");
          reset();
          onOpenChange(false);
          onSuccess();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erro ao cancelar o alerta.",
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar alerta</DialogTitle>
          <DialogDescription>
            Informe o motivo do cancelamento para registro e controle de falsos
            alarmes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Motivo do cancelamento</Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Descreva o motivo do cancelamento..."
              className="min-h-[100px] resize-none"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Voltar
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
