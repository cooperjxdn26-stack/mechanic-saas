"use client";

import Link from "next/link";
import { Eye, Search } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { Purchase, PurchaseStatus } from "@/types/purchase";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseTableProps {
  purchases: Purchase[];
  search: string;
  status: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const statusLabels: Record<PurchaseStatus, string> = {
  DRAFT: "Borrador",
  ORDERED: "Pedido",
  RECEIVED: "Recibido",
  CANCELLED: "Cancelado",
};

export function PurchaseTable({
  purchases,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
}: PurchaseTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Buscar por código o proveedor..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>

            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="ORDERED">Pedido</SelectItem>
                <SelectItem value="RECEIVED">Recibido</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button asChild>
            <Link href="/dashboard/purchases/new">Nueva compra</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[80px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando compras...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron compras.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">
                        {purchase.code}
                      </TableCell>

                      <TableCell>
                        {purchase.supplier?.name ?? "Sin proveedor"}
                      </TableCell>

                      <TableCell>
                        <Badge>{statusLabels[purchase.status]}</Badge>
                      </TableCell>

                      <TableCell>{purchase.items.length}</TableCell>

                      <TableCell>
                        {formatCurrency(Number(purchase.total))}
                      </TableCell>

                      <TableCell>{formatDate(purchase.createdAt)}</TableCell>

                      <TableCell className="text-right">
                        <Button asChild size="icon" variant="ghost">
                          <Link href={`/dashboard/purchases/${purchase.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
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
