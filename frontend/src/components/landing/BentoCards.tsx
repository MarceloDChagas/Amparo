import { BarChart3, Lock, PhoneCall, Users } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const UnifiedRecordCard: React.FC = () => (
  <div
    className="md:col-span-2 rounded-3xl p-8 relative overflow-hidden group border"
    style={{
      backgroundColor: colors.functional.background.card,
      borderColor: colors.functional.border.light,
    }}
  >
    <div className="relative z-10 md:w-1/2">
      <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
        <Users size={24} />
      </div>
      <h3
        className="text-2xl font-bold mb-3"
        style={{ color: colors.functional.text.primary }}
      >
        Prontuário Unificado
      </h3>
      <p
        className="text-lg"
        style={{ color: colors.functional.text.secondary }}
      >
        Histórico psicossocial e jurídico completo em um ambiente altamente
        seguro e auditável.
      </p>
    </div>
    {/* Visual Decorative Element for Card 1 */}
    <div className="absolute right-[-10%] top-[15%] w-[55%] h-[90%] rounded-tl-2xl bg-[#1f2138] border-t border-l border-[#3d3d4e] shadow-2xl p-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-[-10px] transition-all duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-600"></div>
        <div>
          <div className="h-3 w-24 bg-slate-600 rounded mb-2"></div>
          <div className="h-2 w-16 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-700 rounded"></div>
        <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
        <div className="h-2 w-4/6 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
);

export const SecurityCard: React.FC = () => (
  <div
    className="rounded-3xl p-8 relative overflow-hidden border flex flex-col"
    style={{
      backgroundColor: colors.functional.background.card,
      borderColor: colors.functional.border.light,
      background: `linear-gradient(to bottom, ${colors.functional.background.card}, ${colors.accent[950]})`,
    }}
  >
    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
      <Lock size={24} />
    </div>
    <h3
      className="text-2xl font-bold mb-3"
      style={{ color: colors.functional.text.primary }}
    >
      Segurança LGPD
    </h3>
    <p
      className="text-lg flex-1"
      style={{ color: colors.functional.text.secondary }}
    >
      Criptografia de ponta a ponta e total conformidade com a LGPD.
    </p>
    <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center text-sm font-mono text-purple-300">
      <span>AES-256</span>
      <Lock size={14} />
    </div>
  </div>
);

export const SupportNetworkCard: React.FC = () => (
  <div
    className="rounded-3xl p-8 border"
    style={{
      backgroundColor: colors.functional.background.card,
      borderColor: colors.functional.border.light,
    }}
  >
    <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center mb-6">
      <PhoneCall size={24} />
    </div>
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: colors.functional.text.primary }}
    >
      Acionamento Rápido
    </h3>
    <p style={{ color: colors.functional.text.secondary }}>
      Notificação instantânea para órgãos de segurança e contatos de confiança.
    </p>
  </div>
);

export const AnalyticsCard: React.FC = () => (
  <div
    className="md:col-span-2 rounded-3xl p-8 relative overflow-hidden border group"
    style={{
      backgroundColor: colors.functional.background.card,
      borderColor: colors.functional.border.light,
    }}
  >
    <div className="relative z-10 md:w-1/2">
      <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
        <BarChart3 size={24} />
      </div>
      <h3
        className="text-2xl font-bold mb-3"
        style={{ color: colors.functional.text.primary }}
      >
        Inteligência Analítica
      </h3>
      <p
        className="text-lg"
        style={{ color: colors.functional.text.secondary }}
      >
        Identifique manchas criminais e aloque recursos públicos de forma mais
        eficiente.
      </p>
    </div>
    {/* Visual Decorative Element for Card 4 (Bar Chart mockup) */}
    <div className="absolute right-5 bottom-0 h-[60%] w-[40%] flex items-end gap-2 p-4 opacity-70 group-hover:opacity-100 transition-opacity">
      <div
        className="w-full bg-blue-500/40 rounded-t-sm"
        style={{ height: "40%" }}
      ></div>
      <div
        className="w-full bg-blue-500/60 rounded-t-sm"
        style={{ height: "70%" }}
      ></div>
      <div
        className="w-full bg-blue-500/80 rounded-t-sm"
        style={{ height: "50%" }}
      ></div>
      <div
        className="w-full bg-blue-500/30 rounded-t-sm"
        style={{ height: "90%" }}
      ></div>
      <div
        className="w-full bg-blue-500/90 rounded-t-sm"
        style={{ height: "100%" }}
      ></div>
    </div>
  </div>
);
