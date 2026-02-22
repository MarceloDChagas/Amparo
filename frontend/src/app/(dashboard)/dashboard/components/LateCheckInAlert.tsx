import { ClockAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { CheckIn } from "@/services/check-in-service";
import { colors } from "@/styles/colors";

interface LateCheckInAlertProps {
  checkIn: CheckIn;
}

export const LateCheckInAlert: React.FC<LateCheckInAlertProps> = ({
  checkIn,
}) => {
  return (
    <div
      className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group"
      style={{
        backgroundColor: `#f59e0b40`, // A warm dark-warning background
        borderColor: `#f59e0b40`, // Warning color border
      }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl"
        style={{ backgroundColor: "#f59e0b" }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          className="p-4 rounded-xl flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: `#f59e0b20`,
            color: "#f59e0b",
          }}
        >
          <ClockAlert size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1" style={{ color: "#f59e0b" }}>
            Atraso de Deslocamento
          </h4>
          <p
            className="text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            O usuário ID #{checkIn.user?.id?.substring(0, 8) || "Desconhecido"}{" "}
            passou do tempo limite de chegada prevista às{" "}
            {new Date(checkIn.expectedArrivalTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
        </div>
      </div>
      <Link
        href={`/check-ins/${checkIn.id}`}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 relative z-10 whitespace-nowrap text-center"
        style={{
          backgroundColor: "#f59e0b",
          color: "white",
        }}
      >
        Acompanhar
      </Link>
    </div>
  );
};
