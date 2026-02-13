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
import { useGetVictims } from "@/data/hooks/use-get-victims";

const formSchema = z.object({
  description: z.string().min(1, "Description is required."),
  latitude: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Latitude must be a valid number."),
  longitude: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Longitude must be a valid number."),
  victimId: z.string().uuid("Please select a victim."),
  aggressorId: z.string().uuid("Please select an aggressor."),
});

export function OccurrenceForm() {
  const { mutate, isPending } = useCreateOccurrence();
  const { data: victims, isLoading: isLoadingVictims } = useGetVictims();
  const { data: aggressors, isLoading: isLoadingAggressors } =
    useGetAggressors();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      latitude: "0",
      longitude: "0",
      victimId: "",
      aggressorId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      {
        ...values,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      },
      {
        onSuccess: () => {
          toast.success("Occurrence created successfully!");
          form.reset();
        },
        onError: (error) => {
          toast.error(`Failed to create occurrence: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Register Occurrence</CardTitle>
        <CardDescription>Record details of the incident.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what happened..."
                      {...field}
                    />
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
                      <Input type="number" step="any" {...field} />
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
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="victimId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Victim</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a victim" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingVictims ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        victims?.map((victim) => (
                          <SelectItem key={victim.id} value={victim.id}>
                            {victim.name} ({victim.cpf})
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
                  <FormLabel>Aggressor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an aggressor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAggressors ? (
                        <SelectItem value="loading" disabled>
                          Loading...
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
              {isPending ? "Registering..." : "Register Occurrence"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
