import React from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { AuditLog } from "@/services/audit-log-service";

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
        backgroundColor: govTheme.background.section,
        borderColor: govTheme.border.subtle,
        boxShadow: govTheme.shadow.card,
      }}
    >
      <div
        className="text-lg font-bold mb-6"
        style={{ color: govTheme.text.primary }}
      >
        Atividade Recente
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-sm" style={{ color: govTheme.text.secondary }}>
            Nenhuma atividade recente no sistema.
          </div>
        ) : (
          activities.map((activity, i) => (
            <div
              key={activity.id || i}
              className="flex gap-4 p-4 rounded-xl border relative overflow-hidden"
              style={{
                backgroundColor: govTheme.background.alt,
                borderColor: govTheme.border.subtle,
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{
                  backgroundColor: govTheme.brand.blue,
                }}
              />
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: govTheme.text.primary }}
                >
                  {activity.action} - {activity.resource}
                </div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: govTheme.text.muted }}
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
