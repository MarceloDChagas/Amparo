"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEmergencyContact } from "@/data/hooks/use-create-emergency-contact";
import { useGetEmergencyContacts } from "@/data/hooks/use-get-emergency-contacts";
import { useAuth } from "@/presentation/hooks/useAuth";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  phone: z
    .string()
    .transform((val) => val.replace(/[^\d]+/g, ""))
    .refine(
      (val) => val.length >= 10,
      "Telefone deve ter pelo menos 10 dígitos.",
    ),
  email: z
    .string()
    .email("Endereço de email inválido.")
    .optional()
    .or(z.literal("")),
  relationship: z.string().min(1, {
    message: "O parentesco é obrigatório.",
  }),
  priority: z.number().int().min(1, {
    message: "A prioridade deve ser pelo menos 1.",
  }),
});

export function EmergencyContactForm() {
  const { mutate, isPending } = useCreateEmergencyContact();
  const { user } = useAuth();
  const { data: contacts } = useGetEmergencyContacts();
  const inputClassName =
    "h-13 rounded-[14px] border border-[#b9c8d8] bg-[#f8fbff] px-4 text-[15px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-500 focus-visible:border-[#244b7a] focus-visible:ring-4 focus-visible:ring-[rgba(36,75,122,0.14)]";

  const isLimitReached = contacts ? contacts.length >= 3 : false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      relationship: "",
      priority: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLimitReached) {
      toast.error("Limite máximo de 3 contatos atingido.");
      return;
    }

    mutate(
      {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        relationship: values.relationship,
        priority: values.priority,
        userId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Contato de emergência cadastrado com sucesso!");
          form.reset();
        },
        onError: (error) => {
          toast.error(
            `Erro ao cadastrar contato de emergência: ${error.message}`,
          );
        },
      },
    );
  }

  return (
    <Card className="w-full max-w-none border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-foreground">
          Cadastrar Contato de Emergência
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Adicione um contato de confiança que será notificado em caso de
          emergência.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLimitReached && (
          <div
            className="mb-6 flex items-start gap-3 rounded-[18px] border px-4 py-4 bg-destructive/10"
            style={{
              borderColor: "rgba(166, 60, 60, 0.28)",
            }}
          >
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-destructive"
            />
            <p className="text-sm text-destructive">
              <strong>Limite atingido:</strong> Você já alcançou o limite máximo
              de 3 contatos de confiança. Para adicionar um novo contato, remova
              um dos contatos existentes.
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset
              disabled={isLimitReached || isPending}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Nome
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Maria Silva"
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
                  name="relationship"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Parentesco / Relação
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLimitReached || isPending}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`${inputClassName} text-foreground`}
                          >
                            <SelectValue placeholder="Selecione o parentesco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mother">Mãe</SelectItem>
                          <SelectItem value="Father">Pai</SelectItem>
                          <SelectItem value="Sibling">Irmão/Irmã</SelectItem>
                          <SelectItem value="Friend">Amigo(a)</SelectItem>
                          <SelectItem value="Partner">Parceiro(a)</SelectItem>
                          <SelectItem value="Other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-sm text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="(##) #####-####"
                          mask="_"
                          customInput={Input}
                          placeholder="(11) 98765-4321"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Email (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="maria@exemplo.com"
                          className={`${inputClassName} text-foreground`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        O email é usado para notificações de emergência
                      </FormDescription>
                      <FormMessage className="text-sm text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Prioridade
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          className={`${inputClassName} text-foreground`}
                          value={value}
                          onChange={(e) =>
                            onChange(parseInt(e.target.value, 10) || 1)
                          }
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Números menores = maior prioridade
                      </FormDescription>
                      <FormMessage className="text-sm text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-13 w-full rounded-[14px] text-[15px] font-semibold shadow-[0_12px_24px_rgba(31,58,95,0.18)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(31,58,95,0.22)] focus-visible:ring-4 focus-visible:ring-[rgba(36,75,122,0.18)] border-none text-primary-foreground"
                disabled={isLimitReached || isPending}
                style={{
                  backgroundColor: isLimitReached
                    ? "#93a6bb"
                    : "var(--accent-foreground)",
                }}
              >
                {isLimitReached
                  ? "Limite máximo alcançado"
                  : isPending
                    ? "Cadastrando..."
                    : "Cadastrar Contato de Emergência"}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
