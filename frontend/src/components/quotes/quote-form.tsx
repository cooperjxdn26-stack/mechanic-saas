"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import {
  normalizeOptionalId,
  quoteSchema,
  toDateInput,
  toIsoDate,
  type QuoteFormValues,
} from "@/schemas/quote.schema";
import { customersService } from "@/services/customers.service";
import { partsService } from "@/services/parts.service";
import { quotesService } from "@/services/quotes.service";
import { servicesService } from "@/services/services.service";
import { vehiclesService } from "@/services/vehicles.service";
import { workOrdersService } from "@/services/work-orders.service";
import type { Customer } from "@/types/customer";
import type { Part, WorkshopService } from "@/types/inventory";
import type { Quote } from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";
import type { WorkOrder } from "@/types/work-order";

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

interface QuoteFormProps {
  quote?: Quote;
  mode: "create" | "edit";
}

export function QuoteForm({ quote, mode }: QuoteFormProps) {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(true);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema) as any,
    defaultValues: {
      status: quote?.status ?? "DRAFT",
      customerId: quote?.customerId ?? "",
      vehicleId: quote?.vehicleId ?? "NONE",
      workOrderId: quote?.workOrderId ?? "NONE",
      discount: Number(quote?.discount ?? 0),
      tax: Number(quote?.tax ?? 0),
      validUntil: toDateInput(quote?.validUntil),
      notes: quote?.notes ?? "",
      items:
        quote?.items && quote.items.length > 0
          ? quote.items.map((item) => ({
              type: item.type,
              description: item.description,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              discount: Number(item.discount),
              serviceId: item.serviceId ?? "NONE",
              partId: item.partId ?? "NONE",
            }))
          : [
              {
                type: "SERVICE",
                description: "",
                quantity: 1,
                unitPrice: 0,
                discount: 0,
                serviceId: "NONE",
                partId: "NONE",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const isSubmitting = form.formState.isSubmitting;
  const watchedItems = form.watch("items");
  const watchedDiscount = form.watch("discount");
  const watchedTax = form.watch("tax");

  /*
   * Vista previa de totales.
   * El backend vuelve a calcular los montos reales al guardar.
   */
  const totals = useMemo(() => {
    const subtotal = watchedItems.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const itemDiscount = Number(item.discount) || 0;

      return acc + quantity * unitPrice - itemDiscount;
    }, 0);

    const discount = Number(watchedDiscount) || 0;
    const tax = Number(watchedTax) || 0;

    return {
      subtotal,
      discount,
      tax,
      total: subtotal - discount + tax,
    };
  }, [watchedItems, watchedDiscount, watchedTax]);

  /*
   * Cargamos catálogos necesarios:
   * clientes, vehículos, órdenes, servicios y repuestos.
   */
  useEffect(() => {
    async function loadCatalogs(): Promise<void> {
      try {
        setIsLoadingCatalogs(true);

        const [
          customersResponse,
          vehiclesResponse,
          ordersResponse,
          servicesResponse,
          partsResponse,
        ] = await Promise.all([
          customersService.findAll({ page: 1, limit: 100 }),
          vehiclesService.findAll({ page: 1, limit: 100 }),
          workOrdersService.findAll({ page: 1, limit: 100 }),
          servicesService.findAll({ page: 1, limit: 100 }),
          partsService.findAll({ page: 1, limit: 100 }),
        ]);

        setCustomers(customersResponse.data);
        setVehicles(vehiclesResponse.data);
        setOrders(ordersResponse.data);
        setServices(servicesResponse.data);
        setParts(partsResponse.data);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingCatalogs(false);
      }
    }

    void loadCatalogs();
  }, []);

  async function onSubmit(values: QuoteFormValues): Promise<void> {
    try {
      const payload = {
        status: values.status,
        customerId: values.customerId,
        vehicleId: normalizeOptionalId(values.vehicleId),
        workOrderId: normalizeOptionalId(values.workOrderId),
        discount: values.discount,
        tax: values.tax,
        validUntil: toIsoDate(values.validUntil),
        notes: values.notes || undefined,

        /*
         * Limpiamos IDs opcionales.
         * SERVICE usa serviceId; PART usa partId; LABOR/EXTRA no necesitan ambos.
         */
        items: values.items.map((item) => ({
          type: item.type,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          serviceId:
            item.type === "SERVICE"
              ? normalizeOptionalId(item.serviceId)
              : undefined,
          partId:
            item.type === "PART" ? normalizeOptionalId(item.partId) : undefined,
        })),
      };

      if (mode === "create") {
        await quotesService.create(payload);
        toast.success("Cotización creada correctamente");
      } else {
        if (!quote) {
          toast.error("No se encontró la cotización a editar");
          return;
        }

        await quotesService.update(quote.id, payload);
        toast.success("Cotización actualizada correctamente");
      }

      router.push("/dashboard/quotes");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  function addItem(): void {
    append({
      type: "SERVICE",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      serviceId: "NONE",
      partId: "NONE",
    });
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Nueva cotización" : "Editar cotización"}
        </CardTitle>
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
                        <SelectItem value="SENT">Enviada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona cliente" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
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
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Válida hasta</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vehículo opcional" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin vehículo</SelectItem>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate} · {vehicle.brand} {vehicle.model}
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
                name="workOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de trabajo</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Orden opcional" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin orden</SelectItem>
                        {orders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.code} · {order.vehicle?.plate ?? "Sin placa"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-2xl border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Items</p>
                  <p className="text-sm text-muted-foreground">
                    Agrega servicios, repuestos, mano de obra o extras.
                  </p>
                </div>

                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const itemType = form.watch(`items.${index}.type`);

                  return (
                    <div key={field.id} className="rounded-xl border p-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.type`}
                          render={({ field: itemField }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <Select
                                value={itemField.value}
                                onValueChange={itemField.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  <SelectItem value="SERVICE">
                                    Servicio
                                  </SelectItem>
                                  <SelectItem value="PART">Repuesto</SelectItem>
                                  <SelectItem value="LABOR">
                                    Mano de obra
                                  </SelectItem>
                                  <SelectItem value="EXTRA">Extra</SelectItem>
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
                                <Input min={1} type="number" {...itemField} />
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
                                  {...itemField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.discount`}
                          render={({ field: itemField }) => (
                            <FormItem>
                              <FormLabel>Descuento</FormLabel>
                              <FormControl>
                                <Input
                                  min={0}
                                  step="0.01"
                                  type="number"
                                  {...itemField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {itemType === "SERVICE" ? (
                        <FormField
                          control={form.control}
                          name={`items.${index}.serviceId`}
                          render={({ field: itemField }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Servicio del catálogo</FormLabel>
                              <Select
                                value={itemField.value}
                                onValueChange={(value) => {
                                  itemField.onChange(value);

                                  /*
                                   * Al elegir servicio, completamos descripción y precio.
                                   * Esto ahorra tiempo y evita errores manuales.
                                   */
                                  const selectedService = services.find(
                                    (service) => service.id === value,
                                  );

                                  if (selectedService) {
                                    form.setValue(
                                      `items.${index}.description`,
                                      selectedService.name,
                                    );
                                    form.setValue(
                                      `items.${index}.unitPrice`,
                                      Number(selectedService.basePrice),
                                    );
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona servicio" />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  <SelectItem value="NONE">Manual</SelectItem>
                                  {services.map((service) => (
                                    <SelectItem
                                      key={service.id}
                                      value={service.id}
                                    >
                                      {service.name} ·{" "}
                                      {formatCurrency(
                                        Number(service.basePrice),
                                      )}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : null}

                      {itemType === "PART" ? (
                        <FormField
                          control={form.control}
                          name={`items.${index}.partId`}
                          render={({ field: itemField }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Repuesto</FormLabel>
                              <Select
                                value={itemField.value}
                                onValueChange={(value) => {
                                  itemField.onChange(value);

                                  /*
                                   * Al elegir repuesto, completamos descripción y precio venta.
                                   */
                                  const selectedPart = parts.find(
                                    (part) => part.id === value,
                                  );

                                  if (selectedPart) {
                                    form.setValue(
                                      `items.${index}.description`,
                                      selectedPart.name,
                                    );
                                    form.setValue(
                                      `items.${index}.unitPrice`,
                                      Number(selectedPart.salePrice),
                                    );
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona repuesto" />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  <SelectItem value="NONE">Manual</SelectItem>
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
                      ) : null}

                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field: itemField }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Descripción visible en cotización"
                                {...itemField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-4 flex justify-end">
                        <Button
                          disabled={fields.length === 1}
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Quitar item
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descuento global</FormLabel>
                    <FormControl>
                      <Input min={0} step="0.01" type="number" {...field} />
                    </FormControl>
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
                      <Input min={0} step="0.01" type="number" {...field} />
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
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Condiciones, garantía, observaciones..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Summary
                  label="Subtotal"
                  value={formatCurrency(totals.subtotal)}
                />
                <Summary
                  label="Descuento"
                  value={formatCurrency(totals.discount)}
                />
                <Summary label="Impuesto" value={formatCurrency(totals.tax)} />
                <Summary label="Total" value={formatCurrency(totals.total)} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/quotes")}
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
                    Guardar cotización
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
