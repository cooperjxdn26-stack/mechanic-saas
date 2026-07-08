"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import {
  customerSchema,
  parseTags,
  tagsToText,
  type CustomerFormValues,
} from "@/schemas/customer.schema";
import { customersService } from "@/services/customers.service";
import type { Customer } from "@/types/customer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface CustomerFormProps {
  customer?: Customer;
  mode: "create" | "edit";
}

/*
 * Tipo de entrada del formulario.
 * Esto ayuda cuando Zod transforma o normaliza datos internamente.
 */
type CustomerFormInput = z.input<typeof customerSchema>;

export function CustomerForm({ customer, mode }: CustomerFormProps) {
  const router = useRouter();

  const form = useForm<CustomerFormInput, unknown, CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      type: customer?.type ?? "NATURAL",
      status: customer?.status ?? "ACTIVE",
      name: customer?.name ?? "",
      documentNumber: customer?.documentNumber ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
      address: customer?.address ?? "",
      notes: customer?.notes ?? "",
      tagsText: tagsToText(customer?.tags),
      trustLevel: customer?.trustLevel ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CustomerFormValues): Promise<void> {
    try {
      const payload = {
        type: values.type,
        status: values.status,
        name: values.name,
        documentNumber: values.documentNumber || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
        notes: values.notes || undefined,
        tags: parseTags(values.tagsText),
        trustLevel: values.trustLevel,
      };

      if (mode === "create") {
        await customersService.create(payload);
        toast.success("Cliente creado correctamente");
      } else {
        if (!customer) {
          toast.error("No se encontró el cliente a editar");
          return;
        }

        await customersService.update(customer.id, payload);
        toast.success("Cliente actualizado correctamente");
      }

      router.push(routes.customers);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Registrar cliente" : "Editar cliente"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de cliente</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NATURAL">Persona natural</SelectItem>
                        <SelectItem value="COMPANY">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Activo</SelectItem>
                        <SelectItem value="INACTIVE">Inactivo</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="DEBTOR">Deudor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre o razón social</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI/RUC</FormLabel>
                    <FormControl>
                      <Input placeholder="Documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="987654321" {...field} />
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
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input placeholder="cliente@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tagsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="vip, frecuente, flotilla"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trustLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de confianza</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        max={10}
                        type="number"
                        value={field.value ?? 0}
                        onChange={(event) => {
                          const value = event.target.value;

                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas internas del taller..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(routes.customers)}
              >
                Cancelar
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
