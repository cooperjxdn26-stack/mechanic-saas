"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import {
  normalizeSupplierId,
  purchaseSchema,
  type PurchaseFormValues,
} from "@/schemas/purchase.schema";
import { partsService } from "@/services/parts.service";
import { purchasesService } from "@/services/purchases.service";
import { suppliersService } from "@/services/suppliers.service";
import type { Part } from "@/types/inventory";
import type { Supplier } from "@/types/supplier";

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
 * Ayuda cuando Zod transforma o normaliza valores internamente.
 */
type PurchaseFormInput = z.input<typeof purchaseSchema>;

export function PurchaseForm() {
  const router = useRouter();

  const [parts, setParts] = useState<Part[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(true);

  const form = useForm<PurchaseFormInput, unknown, PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema) as any,
    defaultValues: {
      status: "DRAFT",
      supplierId: "NONE",
      tax: 0,
      notes: "",
      items: [
        {
          partId: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const isSubmitting = form.formState.isSubmitting;

  /*
   * Observamos items y tax con useWatch.
   * Esto evita usar form.watch directamente y reduce advertencias.
   */
  const watchedItems =
    useWatch({
      control: form.control,
      name: "items",
    }) ?? [];

  const watchedTax =
    useWatch({
      control: form.control,
      name: "tax",
    }) ?? 0;

  /*
   * Totales calculados en frontend solo para vista previa.
   * El backend recalcula los montos reales al guardar.
   */
  const totals = useMemo(() => {
    const subtotal = watchedItems.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      return acc + quantity * unitPrice;
    }, 0);

    const tax = Number(watchedTax) || 0;

    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [watchedItems, watchedTax]);

  useEffect(() => {
    async function loadCatalogs(): Promise<void> {
      try {
        setIsLoadingCatalogs(true);

        const [partsResponse, suppliersResponse] = await Promise.all([
          partsService.findAll({ page: 1, limit: 100 }),
          suppliersService.findAll({ page: 1, limit: 100 }),
        ]);

        setParts(partsResponse.data);
        setSuppliers(suppliersResponse.data);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingCatalogs(false);
      }
    }

    void loadCatalogs();
  }, []);

  async function onSubmit(values: PurchaseFormValues): Promise<void> {
    try {
      await purchasesService.create({
        status: values.status,
        supplierId: normalizeSupplierId(values.supplierId),
        tax: values.tax,
        notes: values.notes || undefined,
        items: values.items.map((item) => ({
          partId: item.partId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      toast.success("Compra creada correctamente");

      router.push("/dashboard/purchases");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  function addItem(): void {
    append({
      partId: "",
      quantity: 1,
      unitPrice: 0,
    });
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Nueva compra</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="DRAFT">Borrador</SelectItem>
                        <SelectItem value="ORDERED">Pedido</SelectItem>
                        <SelectItem value="RECEIVED">
                          Recibido e ingresar stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Proveedor" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin proveedor</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impuesto</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        step="0.01"
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

            <div className="rounded-2xl border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Items de compra</p>
                  <p className="text-sm text-muted-foreground">
                    Agrega repuestos, cantidades y precio unitario.
                  </p>
                </div>

                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_140px_160px_44px]"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.partId`}
                      render={({ field: itemField }) => (
                        <FormItem>
                          <FormLabel>Repuesto</FormLabel>
                          <Select
                            disabled={isLoadingCatalogs}
                            value={itemField.value}
                            onValueChange={itemField.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona repuesto" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {parts.map((part) => (
                                <SelectItem key={part.id} value={part.id}>
                                  {part.name} · Stock: {part.stock}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field: itemField }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl>
                            <Input
                              min={1}
                              type="number"
                              value={itemField.value ?? 1}
                              onChange={(event) => {
                                const value = event.target.value;

                                itemField.onChange(
                                  value === "" ? 1 : Number(value),
                                );
                              }}
                              onBlur={itemField.onBlur}
                              name={itemField.name}
                              ref={itemField.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field: itemField }) => (
                        <FormItem>
                          <FormLabel>Precio unitario</FormLabel>
                          <FormControl>
                            <Input
                              min={0}
                              step="0.01"
                              type="number"
                              value={itemField.value ?? 0}
                              onChange={(event) => {
                                const value = event.target.value;

                                itemField.onChange(
                                  value === "" ? 0 : Number(value),
                                );
                              }}
                              onBlur={itemField.onBlur}
                              name={itemField.name}
                              ref={itemField.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        disabled={fields.length === 1}
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones de la compra..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Summary
                  label="Subtotal"
                  value={formatCurrency(totals.subtotal)}
                />
                <Summary label="Impuesto" value={formatCurrency(totals.tax)} />
                <Summary label="Total" value={formatCurrency(totals.total)} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/purchases")}
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
                    Guardar compra
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

interface SummaryProps {
  label: string;
  value: string;
}

function Summary({ label, value }: SummaryProps) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
