import React from "react";

import { colors } from "@/styles/colors";

export const RecentActivity: React.FC = () => {
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
        {[
          {
            time: "10 min atrás",
            message: "Nova ocorrência registrada",
            status: "pendente",
          },
          {
            time: "45 min atrás",
            message: "Atualização de status: Em Andamento",
            status: "sucesso",
          },
          {
            time: "2 horas atrás",
            message: "Viatura despachada (ID #114)",
            status: "info",
          },
          {
            time: "3 horas atrás",
            message: "Novo usuário cadastrado",
            status: "info",
          },
        ].map((activity, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-xl border relative overflow-hidden"
            style={{
              backgroundColor: colors.functional.background.tertiary,
              borderColor: "transparent",
            }}
          >
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{
                backgroundColor:
                  activity.status === "sucesso"
                    ? colors.status.success.DEFAULT
                    : activity.status === "pendente"
                      ? colors.status.warning.DEFAULT
                      : colors.status.info.DEFAULT,
              }}
            />
            <div>
              <div
                className="text-sm font-medium mb-1"
                style={{ color: colors.functional.text.primary }}
              >
                {activity.message}
              </div>
              <div
                className="text-xs font-semibold"
                style={{ color: colors.functional.text.tertiary }}
              >
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
