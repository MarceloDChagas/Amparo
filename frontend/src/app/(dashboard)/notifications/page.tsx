"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, CheckCircle, Send, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_OPTIONS } from "@/data/constants/notification-config";
import { useGetUsers } from "@/data/hooks/use-get-users";
import { useSendNotification } from "@/data/hooks/use-notifications";
import { NotificationCategory } from "@/data/services/notification-service";
import { colors } from "@/styles/colors";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  body: z.string().min(1, "Mensagem é obrigatória"),
  category: z.enum([
    "ALERT",
    "SUCCESS",
    "WARNING",
    "INFO",
    "MAINTENANCE",
  ] as const),
  targetId: z.string().optional(),
});

type FormValues = {
  title: string;
  body: string;
  category: NotificationCategory;
  targetId?: string;
};

export default function NotificationsPage() {
  const { mutate: send, isPending } = useSendNotification();
  const { data: users } = useGetUsers();
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", body: "", category: "INFO", targetId: "" },
  });

  const onSubmit = (values: FormValues) => {
    setSent(false);
    send(
      {
        title: values.title,
        body: values.body,
        category: values.category,
        targetId: values.targetId || null,
      },
      {
        onSuccess: () => {
          toast.success("Notificação enviada com sucesso!");
          form.reset();
          setSent(true);
        },
        onError: (err) => {
          toast.error(err.message ?? "Erro ao enviar notificação");
        },
      },
    );
  };

  const isBroadcast = !form.watch("targetId");

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: colors.functional.background.primary }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bell
              className="w-8 h-8"
              style={{ color: colors.secondary[300] }}
            />
            Notificações
          </h2>
          <p
            className="mt-1"
            style={{ color: colors.functional.text.secondary }}
          >
            Envie avisos e alertas para os usuários do aplicativo.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            backgroundColor: colors.functional.background.secondary,
            border: `1px solid ${colors.functional.border.light}`,
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Aviso importante"
                        className="bg-[#1f2138] border-[#3d3d4e] text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Categoria</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md px-3 py-2 text-sm border bg-[#1f2138] border-[#3d3d4e] text-white"
                        {...field}
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva o conteúdo da notificação..."
                        rows={4}
                        className="bg-[#1f2138] border-[#3d3d4e] text-white placeholder:text-gray-500 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target */}
              <FormField
                control={form.control}
                name="targetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Destinatário</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md px-3 py-2 text-sm border bg-[#1f2138] border-[#3d3d4e] text-white"
                        {...field}
                      >
                        <option value="">
                          📢 Todos os usuários (broadcast)
                        </option>
                        {users?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} — {u.email}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription
                      style={{ color: colors.functional.text.tertiary }}
                    >
                      {isBroadcast
                        ? "A notificação será enviada a todos os usuários."
                        : "A notificação será enviada apenas para o usuário selecionado."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Audience badge */}
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: isBroadcast
                    ? "rgba(124, 58, 237, 0.15)"
                    : "rgba(230, 56, 144, 0.12)",
                  border: `1px solid ${isBroadcast ? colors.accent[700] : colors.secondary[700]}`,
                }}
              >
                {isBroadcast ? (
                  <Users size={16} style={{ color: colors.accent[400] }} />
                ) : (
                  <Bell size={16} style={{ color: colors.secondary[400] }} />
                )}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isBroadcast
                      ? colors.accent[300]
                      : colors.secondary[300],
                  }}
                >
                  {isBroadcast
                    ? `Broadcast — ${users?.length ?? "?"} usuário(s)`
                    : "Notificação individual"}
                </span>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold"
                style={{
                  background: colors.gradients.cta,
                  color: "white",
                  border: "none",
                }}
              >
                {isPending ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Enviar Notificação
                  </>
                )}
              </Button>

              {sent && (
                <div className="flex items-center gap-2 text-green-400 text-sm justify-center">
                  <CheckCircle size={16} />
                  Notificação enviada com sucesso!
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
