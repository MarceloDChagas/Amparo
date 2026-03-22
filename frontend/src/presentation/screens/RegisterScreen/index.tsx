"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterScreen() {
  return (
    <AuthShell
      eyebrow="Crie sua conta"
      title={
        <>
          O Amparo está aqui
          <br />
          para te apoiar.
        </>
      }
      description="Registre contatos de emergência, documente ocorrências e acione alertas quando precisar — tudo em um só lugar, com segurança."
      shieldText="Suas informações são confidenciais e protegidas. Somente você tem acesso aos seus dados."
      formTitle="Criar conta"
      formDescription="Preencha os dados abaixo para começar."
      footerPrompt="Já tem uma conta?"
      footerHref="/login"
      footerLinkLabel="Entrar"
    >
      <RegisterForm />
    </AuthShell>
  );
}
