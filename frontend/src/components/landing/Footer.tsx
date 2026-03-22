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

        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">
            Referências institucionais
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              <span>Canal institucional configurável pela prefeitura</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>Rede local de atendimento e proteção do município</span>
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
