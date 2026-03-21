"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/presentation/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputClassName =
    "h-13 rounded-[14px] border border-[#b9c8d8] bg-[#f8fbff] px-4 text-[15px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-500 focus-visible:border-[#244b7a] focus-visible:ring-4 focus-visible:ring-[rgba(36,75,122,0.14)]";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    try {
      const user = await login(values);
      toast.success("Login realizado com sucesso!");

      if (user.role === "VICTIM") {
        router.push("/app");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="text-sm font-semibold text-foreground">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="seu@email.com"
                  className={`${inputClassName} text-foreground`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="text-sm font-semibold text-foreground">
                Senha
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className={`${inputClassName} pr-12 text-foreground`}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-[#244b7a]"
                    style={{ color: "#5b6b7f" }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-sm text-destructive" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-6 h-13 w-full rounded-[14px] text-[15px] font-semibold shadow-[0_12px_24px_rgba(31,58,95,0.18)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(31,58,95,0.22)] focus-visible:ring-4 focus-visible:ring-[rgba(36,75,122,0.18)] bg-accent-foreground text-primary-foreground border-none"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
