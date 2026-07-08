"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  serviceSchema,
  toOptionalNumber,
  type ServiceFormValues,
} from "@/schemas/service.schema";
import { servicesService } from "@/services/services.service";

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

/*
 * Tipo de entrada del formulario.
 * Ayuda cuando Zod transforma o normaliza campos.
 */
type ServiceFormInput = z.input<typeof serviceSchema>;

export function ServiceForm() {
  const router = useRouter();

  const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "OTHER",
      basePrice: 0,
      estimatedTimeMinutes: "",
      isActive: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ServiceFormValues): Promise<void> {
    try {
      await servicesService.create({
        name: values.name.trim(),
        description: values.description || undefined,
        category: values.category,
        basePrice: values.basePrice,
        estimatedTimeMinutes: toOptionalNumber(values.estimatedTimeMinutes),
        isActive: values.isActive,
      });

      toast.success("Servicio creado correctamente");
      router.push("/dashboard/services");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Registrar servicio</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Cambio de aceite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                      <SelectItem value="REPAIR">Reparación</SelectItem>
                      <SelectItem value="DIAGNOSIS">Diagnóstico</SelectItem>
                      <SelectItem value="ELECTRIC">Eléctrico</SelectItem>
                      <SelectItem value="ENGINE">Motor</SelectItem>
                      <SelectItem value="BRAKES">Frenos</SelectItem>
                      <SelectItem value="SUSPENSION">Suspensión</SelectItem>
                      <SelectItem value="TRANSMISSION">Transmisión</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio base</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
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

              <FormField
                control={form.control}
                name="estimatedTimeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo estimado en minutos</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          field.onChange(event.target.value);
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe qué incluye este servicio..."
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
                onClick={() => router.push("/dashboard/services")}
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
