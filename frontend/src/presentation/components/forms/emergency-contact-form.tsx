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
import { useGetVictims } from "@/data/hooks/use-get-victims";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z
    .string()
    .transform((val) => val.replace(/[^\d]+/g, ""))
    .refine((val) => val.length >= 10, "Phone must have at least 10 digits."),
  email: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),
  relationship: z.string().min(1, {
    message: "Relationship is required.",
  }),
  priority: z.number().int().min(1, {
    message: "Priority must be at least 1.",
  }),
  victimId: z.string().uuid({
    message: "Please select a valid victim.",
  }),
});

export function EmergencyContactForm() {
  const { mutate, isPending } = useCreateEmergencyContact();
  const { data: victims, isLoading: isLoadingVictims } = useGetVictims();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      relationship: "",
      priority: 1,
      victimId: "",
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
        victimId: values.victimId,
      },
      {
        onSuccess: () => {
          toast.success("Emergency contact created successfully!");
          form.reset();
        },
        onError: (error) => {
          toast.error(`Failed to create emergency contact: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Register Emergency Contact</CardTitle>
        <CardDescription>
          Add a trusted contact who will be notified in case of emergency.
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
                    <FormLabel>Name</FormLabel>
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
                    <FormLabel>Relationship</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
                    <FormLabel>Phone</FormLabel>
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
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="maria@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Email is used for emergency notifications
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
                    <FormLabel>Priority</FormLabel>
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
                      Lower numbers = higher priority
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="victimId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Victim</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingVictims}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingVictims
                                ? "Loading victims..."
                                : "Select victim"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {victims?.map((victim) => (
                          <SelectItem key={victim.id} value={victim.id}>
                            {victim.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Person this contact is associated with
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Emergency Contact"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
