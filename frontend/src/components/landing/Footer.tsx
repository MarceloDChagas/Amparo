import { Lock, MousePointer2, ShieldCheck } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const Footer: React.FC = () => (
  <footer
    className="pt-20 pb-10"
    style={{
      backgroundColor: colors.functional.background.secondary,
      borderTop: `1px solid ${colors.functional.border.DEFAULT}`,
    }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: colors.gradients.card }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: colors.functional.text.primary }}
            >
              Amparo
            </span>
          </div>
          <p
            className="max-w-sm leading-relaxed"
            style={{ color: colors.functional.text.secondary }}
          >
            Transformando a gestão de crises em proteção real através da
            tecnologia, sigilo e integração.
          </p>
        </div>
        <div>
          <h4
            className="font-bold mb-6"
            style={{ color: colors.functional.text.primary }}
          >
            Suporte
          </h4>
          <ul
            className="space-y-4"
            style={{ color: colors.functional.text.secondary }}
          >
            <li>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Central de Ajuda
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Termos de Uso
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        style={{
          borderTop: `1px solid ${colors.functional.border.DEFAULT}`,
          color: colors.functional.text.tertiary,
        }}
      >
        <p>© 2026 Amparo Tecnologia. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Lock size={14} /> Dados Protegidos
          </span>
          <span className="flex items-center gap-1">
            <MousePointer2 size={14} /> Site Discreto
          </span>
        </div>
      </div>
    </div>
  </footer>
);
