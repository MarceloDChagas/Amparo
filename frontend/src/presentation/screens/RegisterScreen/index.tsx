"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterScreen() {
  return (
    <AuthShell
      eyebrow="Cadastro para acesso autorizado"
      title={
        <>
          Crie sua conta para atuar com
          <br />
          continuidade e coordenação.
        </>
      }
      description="O cadastro integra profissionais e equipes a uma experiência pública preparada para organizar atendimento, contexto do caso e comunicação entre serviços autorizados."
      formTitle="Criar conta"
      formDescription="Preencha os dados abaixo para solicitar acesso ao sistema institucional do Amparo."
      footerPrompt="Já tem uma conta?"
      footerHref="/login"
      footerLinkLabel="Entrar"
    >
      <RegisterForm />
    </AuthShell>
  );
}
