"use client";

import Link from "next/link";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types/customer";

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

interface CustomerTableProps {
  customers: Customer[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onDeactivate: (customer: Customer) => void;
}

function getCustomerStatusLabel(status: Customer["status"]): string {
  const labels: Record<Customer["status"], string> = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    VIP: "VIP",
    DEBTOR: "Deudor",
  };

  return labels[status];
}

function getCustomerTypeLabel(type: Customer["type"]): string {
  const labels: Record<Customer["type"], string> = {
    NATURAL: "Natural",
    COMPANY: "Empresa",
  };

  return labels[type];
}

export function CustomerTable({
  customers,
  search,
  isLoading,
  onSearchChange,
  onDeactivate,
}: CustomerTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar por nombre, DNI/RUC, teléfono o correo..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Button asChild>
            <Link href={`${routes.customers}/new`}>Nuevo cliente</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vehículos</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-30 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={8}
                  >
                    Cargando clientes...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={8}
                  >
                    No se encontraron clientes.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.email ?? "Sin correo"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {customer.documentNumber ?? "Sin documento"}
                      </TableCell>

                      <TableCell>{customer.phone ?? "Sin teléfono"}</TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {getCustomerTypeLabel(customer.type)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge>{getCustomerStatusLabel(customer.status)}</Badge>
                      </TableCell>

                      <TableCell>{customer.vehicles?.length ?? 0}</TableCell>

                      <TableCell>{formatDate(customer.createdAt)}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link href={`${routes.customers}/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`${routes.customers}/${customer.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeactivate(customer)}
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
