"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginScreen() {
  return (
    <AuthShell
      eyebrow="Proteção e acompanhamento"
      title={
        <>
          Bem-vindo
          <br />
          de volta ao Amparo.
        </>
      }
      description="Acesse sua conta para acompanhar alertas, ocorrências e contatos de emergência registrados."
      shieldText="Seus dados são protegidos e seu acesso é privado. Nunca compartilhe sua senha."
      formTitle="Entrar"
      formDescription="Informe seu e-mail e senha para acessar sua conta."
      footerPrompt="Ainda não tem conta?"
      footerHref="/register"
      footerLinkLabel="Criar conta"
    >
      <LoginForm />
    </AuthShell>
  );
}
