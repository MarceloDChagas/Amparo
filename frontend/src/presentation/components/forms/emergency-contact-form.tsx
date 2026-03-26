"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
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
  relationship: z.string().min(1, { message: "O vínculo é obrigatório." }),
});

const inputStyle: React.CSSProperties = {
  height: "52px",
  borderRadius: "14px",
  border: "1px solid rgba(180,140,160,0.35)",
  backgroundColor: "rgba(255,255,255,0.70)",
  paddingLeft: "16px",
  paddingRight: "16px",
  fontSize: "15px",
  color: "#3a2530",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#3a2530",
  marginBottom: "8px",
};

export function EmergencyContactForm() {
  const { mutate, isPending } = useCreateEmergencyContact();
  const { user } = useAuth();
  const { data: contacts } = useGetEmergencyContacts();

  const isLimitReached = contacts ? contacts.length >= 3 : false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", relationship: "" },
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
        priority: (contacts?.length ?? 0) + 1,
        userId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Contato adicionado com sucesso!");
          form.reset();
        },
        onError: () => {
          toast.error("Não foi possível adicionar o contato. Tente novamente.");
        },
      },
    );
  }

  return (
    <div className="w-full">
      {isLimitReached && (
        <div
          className="mb-6 flex items-start gap-3 rounded-[18px] border px-4 py-4"
          style={{
            borderColor: "rgba(166,60,60,0.28)",
            backgroundColor: "#fef2f2",
          }}
        >
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
            style={{ color: "#a63c3c" }}
          />
          <p className="text-sm" style={{ color: "#a63c3c" }}>
            Limite de 3 contatos atingido. Remova um contato para adicionar
            outro.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset
            disabled={isLimitReached || isPending}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label style={labelStyle}>Nome</label>
                    <FormControl>
                      <Input
                        placeholder="Maria Silva"
                        style={inputStyle}
                        className="focus-visible:ring-2 focus-visible:ring-[rgba(196,112,90,0.3)] focus-visible:border-[#c4705a] placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-sm"
                      style={{ color: "#a63c3c" }}
                    />
                  </FormItem>
                )}
              />

              {/* Vínculo */}
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <label style={labelStyle}>Vínculo</label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLimitReached || isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          style={{
                            ...inputStyle,
                            color: field.value ? "#3a2530" : "#94a3b8",
                          }}
                          className="focus-visible:ring-2 focus-visible:ring-[rgba(196,112,90,0.3)] focus-visible:border-[#c4705a]"
                        >
                          <SelectValue placeholder="Selecione..." />
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
                    <FormMessage
                      className="text-sm"
                      style={{ color: "#a63c3c" }}
                    />
                  </FormItem>
                )}
              />

              {/* Telefone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <label style={labelStyle}>Telefone</label>
                    <FormControl>
                      <PatternFormat
                        format="(##) #####-####"
                        mask="_"
                        customInput={Input}
                        placeholder="(11) 98765-4321"
                        style={inputStyle}
                        className="focus-visible:ring-2 focus-visible:ring-[rgba(196,112,90,0.3)] focus-visible:border-[#c4705a] placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-sm"
                      style={{ color: "#a63c3c" }}
                    />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label style={labelStyle}>
                      Email{" "}
                      <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                        (Opcional)
                      </span>
                    </label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="maria@exemplo.com"
                        style={inputStyle}
                        className="focus-visible:ring-2 focus-visible:ring-[rgba(196,112,90,0.3)] focus-visible:border-[#c4705a] placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                      Usado para alertas de emergência
                    </p>
                    <FormMessage
                      className="text-sm"
                      style={{ color: "#a63c3c" }}
                    />
                  </FormItem>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLimitReached || isPending}
              className="w-full h-[52px] rounded-[14px] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{
                backgroundColor: isLimitReached
                  ? "rgba(196,112,90,0.35)"
                  : "#c4705a",
                boxShadow: isLimitReached
                  ? "none"
                  : "0 12px 24px rgba(196,112,90,0.28)",
              }}
            >
              {isLimitReached
                ? "Limite atingido"
                : isPending
                  ? "Salvando..."
                  : "Salvar contato"}
            </button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
