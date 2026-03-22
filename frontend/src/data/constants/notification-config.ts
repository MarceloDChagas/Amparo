import { NotificationCategory } from "@/data/services/notification-service";

export interface NotificationCategoryConfig {
  label: string;
  color: string;
  bg: string;
}

export const CATEGORY_CONFIG: Record<
  NotificationCategory,
  NotificationCategoryConfig
> = {
  ALERT: {
    label: "Alerta",
    color: "#E11D48",
    bg: "rgba(225, 29, 72, 0.12)",
  },
  SUCCESS: {
    label: "Sucesso",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  WARNING: {
    label: "Prevenção",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.12)",
  },
  INFO: {
    label: "Utilidade",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.12)",
  },
  MAINTENANCE: {
    label: "Manutenção",
    color: "#6B7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
};

export const CATEGORY_OPTIONS: {
  value: NotificationCategory;
  label: string;
}[] = (Object.keys(CATEGORY_CONFIG) as NotificationCategory[]).map((key) => ({
  value: key,
  label: CATEGORY_CONFIG[key].label,
}));
