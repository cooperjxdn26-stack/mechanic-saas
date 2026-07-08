import Link from "next/link";
import {
  CalendarDays,
  Car,
  Fuel,
  Gauge,
  Hash,
  Pencil,
  User,
} from "lucide-react";

import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleProfileProps {
  vehicle: Vehicle;
}

function optionalLabel(value?: string | number | null): string {
  if (value === null || typeof value === "undefined" || value === "") {
    return "No definido";
  }

  return String(value);
}

export function VehicleProfile({ vehicle }: VehicleProfileProps) {
  const vehicleTitle = `${vehicle.brand} ${vehicle.model}`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                {vehicleTitle}
                <Badge variant="outline">{vehicle.plate}</Badge>
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Registrado el {formatDate(vehicle.createdAt)}
              </p>
            </div>

            <Button asChild>
              <Link href={`${routes.vehicles}/${vehicle.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem
                icon={Hash}
                label="VIN"
                value={optionalLabel(vehicle.vin)}
              />
              <InfoItem
                icon={Car}
                label="Color"
                value={optionalLabel(vehicle.color)}
              />
              <InfoItem
                icon={CalendarDays}
                label="Año"
                value={optionalLabel(vehicle.year)}
              />
              <InfoItem
                icon={Gauge}
                label="Kilometraje"
                value={`${vehicle.mileage.toLocaleString("es-PE")} km`}
              />
              <InfoItem
                icon={Fuel}
                label="Combustible"
                value={optionalLabel(vehicle.fuelType)}
              />
              <InfoItem
                icon={Car}
                label="Transmisión"
                value={optionalLabel(vehicle.transmission)}
              />
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-medium">Observaciones</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {vehicle.notes ?? "Sin observaciones registradas."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Cliente propietario</CardTitle>
          </CardHeader>

          <CardContent>
            {vehicle.customer ? (
              <Link
                href={`${routes.customers}/${vehicle.customer.id}`}
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
              >
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{vehicle.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.customer.phone ?? "Sin teléfono"} ·{" "}
                    {vehicle.customer.documentNumber ?? "Sin documento"}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No se encontró información del cliente.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit rounded-2xl">
        <CardHeader>
          <CardTitle>Resumen técnico</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <SummaryItem label="Placa" value={vehicle.plate} />
          <SummaryItem label="Marca" value={vehicle.brand} />
          <SummaryItem label="Modelo" value={vehicle.model} />
          <SummaryItem
            label="Kilometraje"
            value={`${vehicle.mileage.toLocaleString("es-PE")} km`}
          />
          <Button asChild className="w-full" variant="outline">
            <Link href={`${routes.vehicles}/${vehicle.id}`}>Ver historial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <div className="rounded-xl bg-muted p-2">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
