"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cpf } from "cpf-cnpj-validator";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateVictim } from "@/data/hooks/use-create-victim";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  cpf: z
    .string()
    .transform((val) => val.replace(/[^\d]+/g, ""))
    .refine((val) => val.length === 11, "O CPF deve ter 11 dígitos.")
    .refine((val) => cpf.isValid(val), "CPF inválido."),
});

export function VictimForm() {
  const { mutate, isPending } = useCreateVictim();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      { name: values.name, cpf: values.cpf },
      {
        onSuccess: () => {
          toast.success("Vítima cadastrada com sucesso!");
          form.reset();
        },
        onError: (error) => {
          toast.error(`Erro ao cadastrar vítima: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Cadastrar Vítima</CardTitle>
        <CardDescription>Por favor, insira os dados da vítima.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="###.###.###-##"
                      mask="_"
                      customInput={Input}
                      placeholder="000.000.000-00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Cadastrando..." : "Cadastrar Vítima"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
