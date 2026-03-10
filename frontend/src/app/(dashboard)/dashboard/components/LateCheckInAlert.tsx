import { ClockAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { CheckIn } from "@/services/check-in-service";

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
        backgroundColor: "rgba(216, 191, 122, 0.18)",
        borderColor: "rgba(216, 191, 122, 0.42)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl"
        style={{ backgroundColor: govTheme.brand.sand }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          className="p-4 rounded-xl flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: "rgba(216, 191, 122, 0.18)",
            color: govTheme.brand.sand,
          }}
        >
          <ClockAlert size={32} />
        </div>
        <div>
          <h4
            className="font-bold text-lg mb-1"
            style={{ color: govTheme.brand.blueStrong }}
          >
            Atraso de Deslocamento
          </h4>
          <p className="text-sm" style={{ color: govTheme.text.secondary }}>
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
          backgroundColor: govTheme.brand.blue,
          color: govTheme.text.inverse,
        }}
      >
        Acompanhar
      </Link>
    </div>
  );
};
