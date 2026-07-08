"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { partSchema, type PartFormValues } from "@/schemas/part.schema";
import { partsService } from "@/services/parts.service";
import type { Part } from "@/types/inventory";

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
import { Textarea } from "@/components/ui/textarea";

interface PartFormProps {
  part?: Part;
  mode: "create" | "edit";
}

export function PartForm({ part, mode }: PartFormProps) {
  const router = useRouter();

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema) as any,
    defaultValues: {
      name: part?.name ?? "",
      code: part?.code ?? "",
      sku: part?.sku ?? "",
      category: part?.category ?? "",
      brand: part?.brand ?? "",
      description: part?.description ?? "",
      stock: part?.stock ?? 0,
      minStock: part?.minStock ?? 0,
      purchasePrice: Number(part?.purchasePrice ?? 0),
      salePrice: Number(part?.salePrice ?? 0),
      location: part?.location ?? "",
      supplierId: part?.supplierId ?? "",
      isActive: part?.isActive ?? true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PartFormValues): Promise<void> {
    try {
      const payload = {
        name: values.name.trim(),
        code: values.code || undefined,
        sku: values.sku || undefined,
        category: values.category || undefined,
        brand: values.brand || undefined,
        description: values.description || undefined,
        /*
         * En creación, stock inicial crea movimiento Kardex en backend.
         * En edición no mandamos stock para evitar alterar inventario manualmente.
         */
        stock: mode === "create" ? values.stock : undefined,
        minStock: values.minStock,
        purchasePrice: values.purchasePrice,
        salePrice: values.salePrice,
        location: values.location || undefined,
        supplierId: values.supplierId || undefined,
        isActive: values.isActive,
      };

      if (mode === "create") {
        await partsService.create(payload);
        toast.success("Repuesto creado correctamente");
      } else {
        if (!part) {
          toast.error("No se encontró el repuesto a editar");
          return;
        }

        await partsService.update(part.id, payload);
        toast.success("Repuesto actualizado correctamente");
      }

      router.push("/dashboard/parts");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Registrar repuesto" : "Editar repuesto"}
        </CardTitle>
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
                    <Input
                      placeholder="Pastillas de freno delanteras"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="PF-DEL-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-PF-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Bosch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Frenos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" ? (
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock inicial</FormLabel>
                      <FormControl>
                        <Input min={0} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock mínimo</FormLabel>
                    <FormControl>
                      <Input min={0} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio compra</FormLabel>
                    <FormControl>
                      <Input min={0} step="0.01" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio venta</FormLabel>
                    <FormControl>
                      <Input min={0} step="0.01" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Estante A-3" {...field} />
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
                      placeholder="Descripción técnica o comercial..."
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
                onClick={() => router.push("/dashboard/parts")}
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
