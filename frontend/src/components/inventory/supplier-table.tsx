"use client";

import Link from "next/link";
import { Eye, Search, Trash2 } from "lucide-react";

import { formatDate } from "@/lib/format";
import type { Supplier } from "@/types/supplier";

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

interface SupplierTableProps {
  suppliers: Supplier[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onDeactivate: (supplier: Supplier) => void;
}

export function SupplierTable({
  suppliers,
  search,
  isLoading,
  onSearchChange,
  onDeactivate,
}: SupplierTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar proveedor, RUC, correo..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Button asChild>
            <Link href="/dashboard/suppliers/new">Nuevo proveedor</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Repuestos</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Cargando proveedores...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron proveedores.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.email ?? "Sin correo"}
                        </p>
                      </TableCell>

                      <TableCell>{supplier.ruc ?? "Sin RUC"}</TableCell>

                      <TableCell>
                        <p>{supplier.contactName ?? "Sin contacto"}</p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.phone ?? "Sin teléfono"}
                        </p>
                      </TableCell>

                      <TableCell>{supplier._count?.parts ?? 0}</TableCell>

                      <TableCell>{supplier._count?.purchases ?? 0}</TableCell>

                      <TableCell>
                        <Badge
                          variant={supplier.isActive ? "default" : "secondary"}
                        >
                          {supplier.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell>{formatDate(supplier.createdAt)}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link href={`/dashboard/suppliers/${supplier.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeactivate(supplier)}
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
