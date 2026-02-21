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

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao realizar cadastro. Tente novamente.";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nome Completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Seu nome"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Confirmar Senha</FormLabel>
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
          className="w-full h-12 rounded-xl font-bold text-md transition-all hover:scale-[1.02] mt-4"
          disabled={loading}
          style={{
            background: colors.gradients.cta,
            boxShadow: `0 8px 25px ${colors.special.shadow.rose}`,
            border: "none",
            color: "#fff",
          }}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
