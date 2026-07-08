"use client";

import Link from "next/link";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { Part } from "@/types/inventory";

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

interface PartTableProps {
  parts: Part[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onDeactivate: (part: Part) => void;
}

export function PartTable({
  parts,
  search,
  isLoading,
  onSearchChange,
  onDeactivate,
}: PartTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar repuesto por nombre, SKU, marca..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/parts/low-stock">Stock bajo</Link>
            </Button>

            <Button asChild>
              <Link href="/dashboard/parts/new">Nuevo repuesto</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repuesto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precios</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[130px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Cargando repuestos...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron repuestos.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? parts.map((part) => {
                    const isLowStock = part.stock <= part.minStock;

                    return (
                      <TableRow key={part.id}>
                        <TableCell>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {part.brand ?? "Sin marca"} ·{" "}
                            {part.category ?? "Sin categoría"}
                          </p>
                        </TableCell>

                        <TableCell>{part.sku ?? "Sin SKU"}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{part.stock}</span>
                            {isLowStock ? (
                              <Badge variant="destructive">Bajo</Badge>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Mínimo: {part.minStock}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-sm">
                            Venta: {formatCurrency(Number(part.salePrice))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Compra: {formatCurrency(Number(part.purchasePrice))}
                          </p>
                        </TableCell>

                        <TableCell>
                          {part.supplier?.name ?? "Sin proveedor"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={part.isActive ? "default" : "secondary"}
                          >
                            {part.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>

                        <TableCell>{formatDate(part.createdAt)}</TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button asChild size="icon" variant="ghost">
                              <Link href={`/dashboard/parts/${part.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button asChild size="icon" variant="ghost">
                              <Link href={`/dashboard/parts/${part.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDeactivate(part)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
