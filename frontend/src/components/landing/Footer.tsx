import { Mail, MapPin, ShieldCheck } from "lucide-react";
import React from "react";

export const Footer: React.FC = () => (
  <footer className="pt-16 pb-10 bg-card border-t border-border">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-primary" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Serviço público de proteção
              </p>
              <span
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                amparo
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
            Portal institucional para acolhimento, acompanhamento e articulação
            da rede pública em casos de violência contra a mulher.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">
            Navegação pública
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="#acesso-rapido"
                className="transition-colors hover:opacity-80"
              >
                Acesso rápido
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="transition-colors hover:opacity-80"
              >
                Como funciona
              </a>
            </li>
            <li>
              <a
                href="#dados-publicos"
                className="transition-colors hover:opacity-80"
              >
                Dados públicos
              </a>
            </li>
          </ul>
        </div>

        {/* ⑧ — seção oculta quando não configurada; exibe link nacional genérico */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">
            Referências nacionais
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              <a
                href="https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/ligue-180"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
              >
                Central de Atendimento à Mulher — Ligue 180
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
              <a
                href="https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/rede-de-atendimento"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
              >
                Rede nacional de atendimento e proteção à mulher
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs border-t border-border text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Amparo. Estrutura visual proposta para
          serviço público municipal de proteção à mulher.
        </p>
        <a href="/login" className="transition-colors hover:opacity-80">
          Acesso Restrito
        </a>
      </div>
    </div>
  </footer>
);
