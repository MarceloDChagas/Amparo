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
import { colors } from "@/styles/colors";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu@email.com"
                  className="bg-[#1f2138] border-[#3d3d4e] text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#9333ea] focus:ring-[#9333ea]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[#f95daf]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    className="bg-[#1f2138] border-[#3d3d4e] text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#9333ea] focus:ring-[#9333ea]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[#f95daf]" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-12 rounded-lg font-semibold text-sm mt-4 transition-opacity hover:opacity-90"
          disabled={loading}
          style={{
            backgroundColor: colors.accent[600],
            border: "none",
            color: "#fff",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
