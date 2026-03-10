"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, CheckCircle, Send, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { govTheme } from "@/components/landing/gov-theme";
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
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page header */}
        <div>
          <h2
            className="flex items-center gap-3 text-3xl font-bold tracking-tight"
            style={{ color: govTheme.text.primary }}
          >
            <Bell className="h-8 w-8" style={{ color: govTheme.brand.blue }} />
            Notificações
          </h2>
          <p className="mt-1" style={{ color: govTheme.text.secondary }}>
            Envie avisos e alertas para os usuários do aplicativo.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            backgroundColor: govTheme.background.section,
            border: `1px solid ${govTheme.border.subtle}`,
            boxShadow: govTheme.shadow.card,
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
                    <FormLabel style={{ color: govTheme.text.primary }}>
                      Título
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Aviso importante"
                        className="border bg-white"
                        style={{
                          borderColor: govTheme.border.subtle,
                          color: govTheme.text.primary,
                          backgroundColor: govTheme.background.section,
                        }}
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
                    <FormLabel style={{ color: govTheme.text.primary }}>
                      Categoria
                    </FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        style={{
                          borderColor: govTheme.border.subtle,
                          color: govTheme.text.primary,
                          backgroundColor: govTheme.background.section,
                        }}
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
                    <FormLabel style={{ color: govTheme.text.primary }}>
                      Mensagem
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva o conteúdo da notificação..."
                        rows={4}
                        className="resize-none border bg-white"
                        style={{
                          borderColor: govTheme.border.subtle,
                          color: govTheme.text.primary,
                          backgroundColor: govTheme.background.section,
                        }}
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
                    <FormLabel style={{ color: govTheme.text.primary }}>
                      Destinatário
                    </FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        style={{
                          borderColor: govTheme.border.subtle,
                          color: govTheme.text.primary,
                          backgroundColor: govTheme.background.section,
                        }}
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
                    <FormDescription style={{ color: govTheme.text.muted }}>
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
                  backgroundColor: govTheme.brand.blueSurface,
                  border: `1px solid ${govTheme.border.strong}`,
                }}
              >
                {isBroadcast ? (
                  <Users size={16} style={{ color: govTheme.brand.blue }} />
                ) : (
                  <Bell size={16} style={{ color: govTheme.brand.blue }} />
                )}
                <span
                  className="text-sm font-medium"
                  style={{ color: govTheme.brand.blueStrong }}
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
                  backgroundColor: govTheme.brand.blue,
                  color: govTheme.text.inverse,
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
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{ color: govTheme.brand.green }}
                >
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
