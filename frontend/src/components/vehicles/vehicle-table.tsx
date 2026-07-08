"use client";

import Link from "next/link";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VehicleTableProps {
  vehicles: Vehicle[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onRemove: (vehicle: Vehicle) => void;
}

function fuelLabel(value?: Vehicle["fuelType"]): string {
  if (!value) return "No definido";

  const labels: Record<NonNullable<Vehicle["fuelType"]>, string> = {
    GASOLINE: "Gasolina",
    DIESEL: "Diésel",
    GAS: "Gas",
    HYBRID: "Híbrido",
    ELECTRIC: "Eléctrico",
    OTHER: "Otro",
  };

  return labels[value];
}

export function VehicleTable({
  vehicles,
  search,
  isLoading,
  onSearchChange,
  onRemove,
}: VehicleTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar por placa, marca, modelo, VIN o cliente..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Button asChild>
            <Link href={`${routes.vehicles}/new`}>Nuevo vehículo</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Combustible</TableHead>
                <TableHead>Kilometraje</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead className="w-30 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    Cargando vehículos...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && vehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No se encontraron vehículos.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.year ?? "Año no definido"} ·{" "}
                            {vehicle.color ?? "Sin color"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{vehicle.plate}</Badge>
                      </TableCell>

                      <TableCell>
                        {vehicle.customer?.name ?? "Cliente no disponible"}
                      </TableCell>

                      <TableCell>{fuelLabel(vehicle.fuelType)}</TableCell>

                      <TableCell>
                        {vehicle.mileage.toLocaleString("es-PE")} km
                      </TableCell>

                      <TableCell>{formatDate(vehicle.createdAt)}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link href={`${routes.vehicles}/${vehicle.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`${routes.vehicles}/${vehicle.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onRemove(vehicle)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
