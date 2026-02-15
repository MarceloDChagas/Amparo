"use client";

import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
