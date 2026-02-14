import { ChevronRight, Shield } from "lucide-react";
import React from "react";

export const HeroSectionInstitutional: React.FC = () => (
  <header className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#f5f7fa] via-[#e6ebf1] to-[#e3f2fd]">
    {/* Animated Blobs - Navy/Royal theme */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#194e8a]/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
    <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-[#1976d2]/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#0f3c77]/15 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>

    <div className="relative max-w-7xl mx-auto px-6">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e3f2fd] text-[#1565c0] text-sm font-bold mb-8 animate-fade-in border border-[#90caf9]/30">
          <Shield size={16} />
          <span>SISTEMA DE PROTEÇÃO INTEGRADO</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0f3c77] mb-8 leading-[1.1]">
          Proteção e cuidado quando{" "}
          <span className="bg-gradient-to-r from-[#194e8a] via-[#1976d2] to-[#194e8a] bg-clip-text text-transparent animate-gradient-x">
            mais importa.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#495057] mb-10 leading-relaxed max-w-2xl mx-auto">
          Plataforma digital especializada na gestão de casos de violência
          doméstica, conectando vítimas a uma rede de apoio segura e eficiente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/login"
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#194e8a] to-[#1976d2] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
          >
            Acessar Painel
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#1976d2] border-2 border-[#1976d2] rounded-2xl font-bold text-lg shadow-sm hover:shadow-md hover:bg-[#e3f2fd] transition-all">
            Ver Demonstração
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 font-bold text-xl text-[#495057]">
            GUARDA MUNICIPAL
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-[#495057]">
            PREFEITURA
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-[#495057]">
            ASSISTÊNCIA SOCIAL
          </div>
        </div>
      </div>
    </div>
  </header>
);
