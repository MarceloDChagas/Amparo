import { Phone, Video } from "lucide-react";
import Link from "next/link";

import { colors } from "@/styles/colors";

export function ActionButtons() {
  return (
    <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8 px-4">
      {/* Emergency Contacts Button */}
      <Link href="/app/contacts" className="flex-1">
        <button
          className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: colors.secondary[300] }}
        >
          <Phone size={24} style={{ color: colors.primary[900] }} />
          <span
            className="font-semibold text-xs text-center leading-tight"
            style={{ color: colors.primary[900] }}
          >
            Contatos de{"\n"}Emergência
          </span>
        </button>
      </Link>

      {/* My Recordings Button */}
      <button
        className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: colors.secondary[300] }}
      >
        <Video size={24} style={{ color: colors.primary[900] }} />
        <span
          className="font-semibold text-xs text-center leading-tight"
          style={{ color: colors.primary[900] }}
        >
          Minhas{"\n"}Notas
        </span>
      </button>
    </div>
  );
}
