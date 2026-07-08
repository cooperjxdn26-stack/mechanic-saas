"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import {
  toDateTimeLocal,
  toIsoDateTime,
  workOrderSchema,
  type WorkOrderFormValues,
} from "@/schemas/work-order.schema";
import { vehiclesService } from "@/services/vehicles.service";
import { workOrdersService } from "@/services/work-orders.service";
import type { Vehicle } from "@/types/vehicle";
import type { CreateWorkOrderPayload, WorkOrder } from "@/types/work-order";

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

interface WorkOrderFormProps {
  workOrder?: WorkOrder;
  mode: "create" | "edit";
}

export function WorkOrderForm({ workOrder, mode }: WorkOrderFormProps) {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState<boolean>(true);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema) as any,
    defaultValues: {
      reason: workOrder?.reason ?? "",
      reportedSymptoms: workOrder?.reportedSymptoms ?? "",
      initialDiagnosis: workOrder?.initialDiagnosis ?? "",
      internalNotes: workOrder?.internalNotes ?? "",
      priority: workOrder?.priority ?? "MEDIUM",
      estimatedDelivery: toDateTimeLocal(workOrder?.estimatedDelivery),
      vehicleId: workOrder?.vehicleId ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  /*
   * Cargamos vehículos para asociar la orden.
   * Evitamos depender de IDs escritos manualmente.
   */
  useEffect(() => {
    async function loadVehicles(): Promise<void> {
      try {
        setIsLoadingVehicles(true);

        const response = await vehiclesService.findAll({
          page: 1,
          limit: 100,
        });

        setVehicles(response.data);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingVehicles(false);
      }
    }

    void loadVehicles();
  }, []);

  async function onSubmit(values: WorkOrderFormValues): Promise<void> {
    try {
      const payload: CreateWorkOrderPayload = {
        reason: values.reason.trim(),
        reportedSymptoms: values.reportedSymptoms || undefined,
        initialDiagnosis: values.initialDiagnosis || undefined,
        internalNotes: values.internalNotes || undefined,
        priority: values.priority,
        estimatedDelivery: toIsoDateTime(values.estimatedDelivery),
        vehicleId: values.vehicleId,
      };

      if (mode === "create") {
        await workOrdersService.create(payload);
        toast.success("Orden creada correctamente");
      } else {
        if (!workOrder) {
          toast.error("No se encontró la orden a editar");
          return;
        }

        await workOrdersService.update(workOrder.id, payload);
        toast.success("Orden actualizada correctamente");
      }

      router.push(routes.workOrders);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Crear orden de trabajo" : "Editar orden"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehículo</FormLabel>
                  <Select
                    disabled={isLoadingVehicles}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingVehicles
                              ? "Cargando vehículos..."
                              : "Selecciona un vehículo"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} · {vehicle.brand} {vehicle.model}
                          {vehicle.customer?.name
                            ? ` · ${vehicle.customer.name}`
                            : ""}
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de ingreso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Ruido fuerte al frenar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona prioridad" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="LOW">Baja</SelectItem>
                        <SelectItem value="MEDIUM">Media</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrega estimada</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reportedSymptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Síntomas reportados</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe lo que reporta el cliente..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialDiagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico inicial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Primera revisión de recepción..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas internas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones internas del taller..."
                      rows={3}
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
                onClick={() => router.push(routes.workOrders)}
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
