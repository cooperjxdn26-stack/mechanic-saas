"use client";

import Link from "next/link";
import { Search, Trash2 } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { WorkshopService } from "@/types/inventory";

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

interface ServiceTableProps {
  services: WorkshopService[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onDeactivate: (service: WorkshopService) => void;
}

export function ServiceTable({
  services,
  search,
  isLoading,
  onSearchChange,
  onDeactivate,
}: ServiceTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar servicio..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Button asChild>
            <Link href="/dashboard/services/new">Nuevo servicio</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio base</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando servicios...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron servicios.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.description ?? "Sin descripción"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{service.category}</Badge>
                      </TableCell>

                      <TableCell>
                        {formatCurrency(Number(service.basePrice))}
                      </TableCell>

                      <TableCell>
                        {service.estimatedTimeMinutes
                          ? `${service.estimatedTimeMinutes} min`
                          : "No definido"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                        >
                          {service.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell>{formatDate(service.createdAt)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeactivate(service)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
