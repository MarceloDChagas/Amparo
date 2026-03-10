import { Mail, MapPin, ShieldCheck } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const Footer: React.FC = () => (
  <footer
    className="pt-16 pb-10"
    style={{
      backgroundColor: colors.functional.background.primary,
      borderTop: `1px solid ${colors.functional.border.dark}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} style={{ color: colors.accent[400] }} />
            <span
              className="text-base font-bold"
              style={{ color: colors.functional.text.primary }}
            >
              Amparo
            </span>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: colors.functional.text.secondary }}
          >
            Plataforma institucional para gestão integrada de proteção e
            acolhimento em casos de violência doméstica.
          </p>
        </div>

        <div>
          <h4
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: colors.functional.text.tertiary }}
          >
            Sistema
          </h4>
          <ul
            className="space-y-3 text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentação
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

        <div>
          <h4
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: colors.functional.text.tertiary }}
          >
            Contato
          </h4>
          <ul
            className="space-y-3 text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            <li className="flex items-center gap-2">
              <Mail size={14} style={{ color: colors.accent[400] }} />
              <a
                href="mailto:preencherdepois@gmail.com"
                className="hover:text-white transition-colors"
              >
                preencherdepois@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0"
                style={{ color: colors.accent[400] }}
              />
              <span>Olinda - PE, 52000-000</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
        style={{
          borderTop: `1px solid ${colors.functional.border.dark}`,
          color: colors.functional.text.tertiary,
        }}
      >
        <p>
          © {new Date().getFullYear()} Sistema Amparo de Proteção Institucional.
          Todos os direitos reservados.
        </p>
        <a href="/login" className="transition-colors hover:text-white">
          Acesso Restrito
        </a>
      </div>
    </div>
  </footer>
);
