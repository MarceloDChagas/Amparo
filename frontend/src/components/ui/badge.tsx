import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Componente de badge semântico para status de alertas e check-ins.
 *
 * NRF10 — Acessibilidade: cada variante combina ícone + cor + texto.
 * Nunca usar cor como único indicador de estado — o ícone carrega o significado
 * mesmo para usuários com deficiência de visão de cor.
 *
 * RF03 — Check-in: variantes `active`, `late`, `on-time` para ciclo de vida.
 * RF01 — Emergência: variante `danger` para alertas críticos no Dashboard.
 * RF13 — Gestão de Ocorrências: variantes refletem estados do ciclo de vida.
 */

export type BadgeVariant =
  | "default"
  | "active"
  | "late"
  | "danger"
  | "success"
  | "warning"
  | "pending";

interface BadgeConfig {
  icon: LucideIcon | null;
  classes: string;
  label: string;
}

const badgeConfig: Record<BadgeVariant, BadgeConfig> = {
  default: {
    icon: null,
    classes: "bg-muted text-muted-foreground border-transparent",
    label: "",
  },
  /** Check-in / alerta ativo e dentro do prazo */
  active: {
    icon: CheckCircle2,
    classes:
      "bg-success-soft text-success border-success/20 dark:bg-success/10 dark:text-success",
    label: "Ativo",
  },
  /** Check-in vencido sem confirmação de chegada — RN03 */
  late: {
    icon: Clock,
    classes:
      "bg-warning-soft text-warning border-warning/20 dark:bg-warning/10 dark:text-warning",
    label: "Atrasado",
  },
  /** Alerta de emergência crítico — RF01 */
  danger: {
    icon: AlertTriangle,
    classes:
      "bg-emergency-soft text-emergency border-emergency/20 dark:bg-emergency/10 dark:text-emergency",
    label: "Crítico",
  },
  /** Ação concluída com sucesso */
  success: {
    icon: CheckCircle2,
    classes:
      "bg-success-soft text-success border-success/20 dark:bg-success/10 dark:text-success",
    label: "Concluído",
  },
  /** Estado de atenção — check-in próximo do vencimento, alerta moderado */
  warning: {
    icon: AlertCircle,
    classes:
      "bg-warning-soft text-warning border-warning/20 dark:bg-warning/10 dark:text-warning",
    label: "Atenção",
  },
  /** Aguardando ação ou processamento */
  pending: {
    icon: Loader2,
    classes:
      "bg-muted text-muted-foreground border-transparent dark:bg-muted/50",
    label: "Pendente",
  },
};

interface BadgeProps extends React.HTMLAttributes<"span"> {
  variant?: BadgeVariant;
  /** Oculta o ícone. Usar apenas quando o contexto torna o estado óbvio. */
  hideIcon?: boolean;
}

function Badge({
  variant = "default",
  hideIcon = false,
  className,
  children,
  ...props
}: BadgeProps & React.HTMLAttributes<HTMLSpanElement>) {
  const config = badgeConfig[variant];
  const Icon = config.icon;

  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        // Ícone animado para estado pendente
        variant === "pending" && "[&_svg]:animate-spin",
        className,
      )}
      {...props}
    >
      {/* NRF10 — ícone é decorativo quando texto está presente; aria-hidden evita redundância */}
      {!hideIcon && Icon && (
        <Icon className="size-3 shrink-0" aria-hidden="true" />
      )}
      {children ?? config.label}
    </span>
  );
}

export { Badge };
