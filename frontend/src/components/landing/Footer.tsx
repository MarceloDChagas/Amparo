import { Lock, Mail, MapPin, MousePointer2, ShieldCheck } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const Footer: React.FC = () => (
  <footer
    className="pt-24 pb-12"
    style={{
      backgroundColor: colors.functional.background.primary,
      borderTop: `1px solid ${colors.functional.border.light}`,
    }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-6 cursor-pointer">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: colors.gradients.card }}
            >
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: colors.functional.text.primary }}
            >
              Amparo
            </span>
          </div>
          <p
            className="text-base leading-relaxed mb-8 max-w-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            Plataforma institucional para gestão integrada de proteção e
            acolhimento. Tecnologia a serviço da vida e segurança pública.
          </p>
          <div
            className="flex items-center gap-4 text-sm font-medium"
            style={{ color: colors.accent[300] }}
          >
            <span className="flex items-center gap-1 bg-[#7c3aed] bg-opacity-10 px-3 py-1.5 rounded-full border border-[#7c3aed] border-opacity-20">
              <Lock size={14} /> Ambiente Seguro
            </span>
            <span className="flex items-center gap-1 bg-[#10b981] bg-opacity-10 px-3 py-1.5 rounded-full border border-[#10b981] border-opacity-20 text-[#10b981]">
              <ShieldCheck size={14} /> ISO 27001
            </span>
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <h4
            className="font-bold mb-6 tracking-wider text-sm"
            style={{ color: colors.functional.text.primary }}
          >
            SISTEMA
          </h4>
          <ul
            className="space-y-4 text-sm font-medium"
            style={{ color: colors.functional.text.secondary }}
          >
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Status da API
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Convênio
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Portal da Transparência
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4
            className="font-bold mb-6 tracking-wider text-sm"
            style={{ color: colors.functional.text.primary }}
          >
            CONTATO INSTITUCIONAL
          </h4>
          <ul
            className="space-y-4 text-sm font-medium"
            style={{ color: colors.functional.text.secondary }}
          >
            <li className="flex items-start gap-3">
              <Mail
                size={18}
                className="mt-0.5 opacity-70"
                style={{ color: colors.accent[300] }}
              />
              <a
                href="mailto:preencherdepois@gmail.com"
                className="hover:text-white transition-colors"
              >
                preencherdepois@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin
                size={18}
                className="mt-0.5 opacity-70"
                style={{ color: colors.accent[300] }}
              />
              <span className="leading-relaxed">
                Preencherdepois 4<br />
                Olinda - PE, 52000-000
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm"
        style={{
          borderTop: `1px solid ${colors.functional.border.dark}`,
          color: colors.functional.text.tertiary,
        }}
      >
        <p>
          © {new Date().getFullYear()} Sistema Amparo de Proteção Institucional.
          Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="/login"
            className="flex items-center gap-2 hover:text-white transition-colors font-semibold"
          >
            <Lock size={14} /> Acesso Restrito
          </a>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded border transition-colors hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            style={{ borderColor: colors.functional.border.light }}
          >
            <MousePointer2 size={14} /> Saída Rápida (Esc)
          </button>
        </div>
      </div>
    </div>
  </footer>
);
