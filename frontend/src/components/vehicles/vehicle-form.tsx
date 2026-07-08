"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { customersService } from "@/services/customers.service";
import { vehiclesService } from "@/services/vehicles.service";
import {
  toOptionalNumber,
  vehicleSchema,
  type VehicleFormValues,
} from "@/schemas/vehicle.schema";
import type { Customer } from "@/types/customer";
import type { CreateVehiclePayload, Vehicle } from "@/types/vehicle";

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

interface VehicleFormProps {
  vehicle?: Vehicle;
  mode: "create" | "edit";
}

/*
 * Tipo de entrada del formulario.
 * Ayuda cuando Zod normaliza o transforma valores.
 */
type VehicleFormInput = z.input<typeof vehicleSchema>;

export function VehicleForm({ vehicle, mode }: VehicleFormProps) {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(true);

  const form = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      plate: vehicle?.plate ?? "",
      brand: vehicle?.brand ?? "",
      model: vehicle?.model ?? "",
      year: vehicle?.year ?? "",
      color: vehicle?.color ?? "",
      vin: vehicle?.vin ?? "",
      mileage: vehicle?.mileage ?? 0,
      fuelType: vehicle?.fuelType ?? undefined,
      transmission: vehicle?.transmission ?? undefined,
      type: vehicle?.type ?? undefined,
      notes: vehicle?.notes ?? "",
      customerId: vehicle?.customerId ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  /*
   * Cargamos clientes para asociar el vehículo.
   * Esto evita crear vehículos huérfanos.
   */
  useEffect(() => {
    async function loadCustomers(): Promise<void> {
      try {
        setIsLoadingCustomers(true);

        const response = await customersService.findAll({
          page: 1,
          limit: 100,
        });

        setCustomers(response.data);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingCustomers(false);
      }
    }

    void loadCustomers();
  }, []);

  async function onSubmit(values: VehicleFormValues): Promise<void> {
    try {
      const payload: CreateVehiclePayload = {
        plate: values.plate.trim().toUpperCase(),
        brand: values.brand.trim(),
        model: values.model.trim(),
        year: toOptionalNumber(values.year),
        color: values.color || undefined,
        vin: values.vin || undefined,
        mileage: values.mileage,
        fuelType: values.fuelType,
        transmission: values.transmission,
        type: values.type,
        notes: values.notes || undefined,
        customerId: values.customerId,
      };

      if (mode === "create") {
        await vehiclesService.create(payload);
        toast.success("Vehículo creado correctamente");
      } else {
        if (!vehicle) {
          toast.error("No se encontró el vehículo a editar");
          return;
        }

        await vehiclesService.update(vehicle.id, payload);
        toast.success("Vehículo actualizado correctamente");
      }

      router.push(routes.vehicles);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Registrar vehículo" : "Editar vehículo"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente propietario</FormLabel>
                  <Select
                    disabled={isLoadingCustomers}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCustomers
                              ? "Cargando clientes..."
                              : "Selecciona un cliente"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}{" "}
                          {customer.documentNumber
                            ? `· ${customer.documentNumber}`
                            : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123" {...field} />
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
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2018"
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

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Blanco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de identificación vehicular"
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
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combustible</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona combustible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GASOLINE">Gasolina</SelectItem>
                        <SelectItem value="DIESEL">Diésel</SelectItem>
                        <SelectItem value="GAS">Gas</SelectItem>
                        <SelectItem value="HYBRID">Híbrido</SelectItem>
                        <SelectItem value="ELECTRIC">Eléctrico</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmisión</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona transmisión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                        <SelectItem value="AUTOMATIC">Automática</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="OTHER">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de vehículo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEDAN">Sedán</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="PICKUP">Pickup</SelectItem>
                        <SelectItem value="VAN">Van</SelectItem>
                        <SelectItem value="TRUCK">Camión</SelectItem>
                        <SelectItem value="MOTORCYCLE">Motocicleta</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Observaciones generales del vehículo..."
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
                onClick={() => router.push(routes.vehicles)}
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
