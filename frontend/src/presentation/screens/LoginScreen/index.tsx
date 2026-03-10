"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginScreen() {
  return (
    <AuthShell
      eyebrow="Plataforma integrada de proteção"
      title={
        <>
          Acesse o Amparo para acompanhar ocorrências, acionar fluxos de
          resposta e atuar com segurança na rede pública autorizada.
        </>
      }
      description="Use suas credenciais para entrar no ambiente institucional do Amparo e acessar, com segurança, os recursos de monitoramento, acompanhamento e coordenação entre os serviços públicos responsáveis pela proteção das mulheres."
      formTitle="Entrar"
      formDescription="Informe seus dados para acessar sua conta e acompanhar atendimentos, ocorrências e casos sob sua responsabilidade."
      footerPrompt="Ainda não tem acesso?"
      footerHref="/register"
      footerLinkLabel="Solicitar cadastro"
    >
      <LoginForm />
    </AuthShell>
  );
}
