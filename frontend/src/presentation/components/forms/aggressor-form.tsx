"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cpf } from "cpf-cnpj-validator";
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
import { useCreateAggressor } from "@/data/hooks/use-create-aggressor";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  cpf: z
    .string()
    .transform((val) => val.replace(/[^\d]+/g, ""))
    .refine((val) => val.length === 11, "CPF must have 11 digits.")
    .refine((val) => cpf.isValid(val), "Invalid CPF."),
});

export function AggressorForm() {
  const { mutate, isPending } = useCreateAggressor();

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
          toast.success("Aggressor created successfully!");
          form.reset();
        },
        onError: (error) => {
          toast.error(`Failed to create aggressor: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Aggressor</CardTitle>
        <CardDescription>Please enter the aggressor details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
              {isPending ? "Creating..." : "Create Aggressor"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
