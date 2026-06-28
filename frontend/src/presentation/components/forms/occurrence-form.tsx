"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOccurrence } from "@/data/hooks/use-create-occurrence";
import { useGetAggressors } from "@/data/hooks/use-get-aggressors";
import { useGetUsers } from "@/data/hooks/use-get-users";
import { EmergencyAlert } from "@/services/emergency-alert-service";

const formSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória."),
  latitude: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) !== 0,
      "Latitude inválida — informe uma coordenada real.",
    ),
  longitude: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) !== 0,
      "Longitude inválida — informe uma coordenada real.",
    ),
  userId: z.string().uuid("Selecione um usuário."),
  aggressorId: z.string().optional(),
});

interface OccurrenceFormProps {
  selectedAlert?: EmergencyAlert;
}

export function OccurrenceForm({ selectedAlert }: OccurrenceFormProps) {
  const { mutate, isPending } = useCreateOccurrence();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { data: aggressors, isLoading: isLoadingAggressors } =
    useGetAggressors();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      latitude: selectedAlert ? String(selectedAlert.latitude) : "0",
      longitude: selectedAlert ? String(selectedAlert.longitude) : "0",
      userId: selectedAlert?.userId || "",
      aggressorId: "none",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitData: any = {
      description: values.description,
      userId: values.userId,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    };

    if (values.aggressorId && values.aggressorId !== "none") {
      submitData.aggressorId = values.aggressorId;
    }

    mutate(submitData, {
      onSuccess: () => {
        toast.success("Occurrence created successfully!");
        form.reset();
      },
      onError: (error) => {
        toast.error(`Failed to create occurrence: ${error.message}`);
      },
    });
  }

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Registrar Ocorrência</CardTitle>
        <CardDescription>
          Registre os detalhes do incidente com base no chamado selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o ocorrido..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-8.3323"
                        readOnly={!!selectedAlert}
                        className={
                          selectedAlert ? "bg-muted cursor-default" : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-36.4215"
                        readOnly={!!selectedAlert}
                        className={
                          selectedAlert ? "bg-muted cursor-default" : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : (
                        users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.cpf})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aggressorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agressor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um agressor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        Não Identificado / Opcional
                      </SelectItem>
                      {isLoadingAggressors ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : (
                        aggressors?.map((aggressor) => (
                          <SelectItem key={aggressor.id} value={aggressor.id}>
                            {aggressor.name} ({aggressor.cpf})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar Ocorrência"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
