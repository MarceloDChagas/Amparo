import { NotebookPen, Users } from "lucide-react";
import Link from "next/link";

import { colors } from "@/styles/colors";

export function ActionButtons() {
  return (
    <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8 px-4">
      <Link href="/app/contacts" className="flex-1">
        <button
          className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: colors.accent[600] }}
        >
          <Users size={24} color="white" />
          <span className="font-semibold text-xs text-center leading-tight text-white">
            Rede de{"\n"}apoio
          </span>
        </button>
      </Link>

      <Link href="/app/notes" className="flex-1">
        <button
          className="w-full rounded-2xl py-4 px-3 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: colors.accent[600] }}
        >
          <NotebookPen size={24} color="white" />
          <span className="font-semibold text-xs text-center leading-tight text-white">
            Memória do{"\n"}caso
          </span>
        </button>
      </Link>
    </div>
  );
}
