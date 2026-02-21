import React from "react";

import { AuditLog } from "@/services/audit-log-service";
import { colors } from "@/styles/colors";

interface RecentActivityProps {
  activities?: AuditLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
}) => {
  return (
    <div
      className="p-6 rounded-2xl border"
      style={{
        backgroundColor: colors.functional.background.card,
        borderColor: colors.functional.border.light,
      }}
    >
      <div
        className="text-lg font-bold mb-6"
        style={{ color: colors.functional.text.primary }}
      >
        Atividade Recente
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div
            className="text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            Nenhuma atividade recente no sistema.
          </div>
        ) : (
          activities.map((activity, i) => (
            <div
              key={activity.id || i}
              className="flex gap-4 p-4 rounded-xl border relative overflow-hidden"
              style={{
                backgroundColor: colors.functional.background.tertiary,
                borderColor: "transparent",
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{
                  backgroundColor: colors.status.info.DEFAULT,
                }}
              />
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: colors.functional.text.primary }}
                >
                  {activity.action} - {activity.resource}
                </div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: colors.functional.text.tertiary }}
                >
                  {new Date(activity.createdAt).toLocaleString("pt-BR")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
