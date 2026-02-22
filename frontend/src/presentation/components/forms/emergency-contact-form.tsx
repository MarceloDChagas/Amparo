"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useGetUsers } from "@/data/hooks/use-get-users";

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
  userId: z.string().min(1, "Por favor, selecione um usuário.").uuid({
    message: "Por favor, selecione um usuário válido.",
  }),
});

export function EmergencyContactForm() {
  const { mutate, isPending } = useCreateEmergencyContact();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      relationship: "",
      priority: 1,
      userId: undefined, // Changed to undefined to avoid immediate validation error
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        relationship: values.relationship,
        priority: values.priority,
        userId: values.userId,
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Cadastrar Contato de Emergência</CardTitle>
        <CardDescription>
          Adicione um contato de confiança que será notificado em caso de
          emergência.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Maria Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parentesco / Relação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="(##) #####-####"
                        mask="_"
                        customInput={Input}
                        placeholder="(11) 98765-4321"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="maria@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      O email é usado para notificações de emergência
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={value}
                        onChange={(e) =>
                          onChange(parseInt(e.target.value, 10) || 1)
                        }
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormDescription>
                      Números menores = maior prioridade
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingUsers
                                ? "Carregando usuários..."
                                : "Selecione o usuário"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pessoa com quem este contato está associado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Cadastrando..." : "Cadastrar Contato de Emergência"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
