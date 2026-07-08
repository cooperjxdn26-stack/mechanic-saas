"use client";

import Link from "next/link";
import { PackageCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { purchasesService } from "@/services/purchases.service";
import type { Purchase, PurchaseStatus } from "@/types/purchase";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseDetailProps {
  purchase: Purchase;
  onRefresh: () => Promise<void>;
}

const statusLabels: Record<PurchaseStatus, string> = {
  DRAFT: "Borrador",
  ORDERED: "Pedido",
  RECEIVED: "Recibido",
  CANCELLED: "Cancelado",
};

export function PurchaseDetail({ purchase, onRefresh }: PurchaseDetailProps) {
  async function handleReceive(): Promise<void> {
    const shouldReceive = window.confirm(
      "¿Deseas recibir esta compra? Esto aumentará el stock y creará movimientos Kardex.",
    );

    if (!shouldReceive) {
      return;
    }

    try {
      /*
       * Acción crítica:
       * el backend cambia estado, aumenta stock y registra Kardex.
       */
      await purchasesService.receive(purchase.id);
      toast.success("Compra recibida y stock actualizado");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleCancel(): Promise<void> {
    const shouldCancel = window.confirm("¿Deseas cancelar esta compra?");

    if (!shouldCancel) {
      return;
    }

    try {
      await purchasesService.cancel(purchase.id);
      toast.success("Compra cancelada");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const canReceive =
    purchase.status !== "RECEIVED" && purchase.status !== "CANCELLED";
  const canCancel =
    purchase.status !== "RECEIVED" && purchase.status !== "CANCELLED";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              {purchase.code}
              <Badge>{statusLabels[purchase.status]}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Creado el {formatDateTime(purchase.createdAt)}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Info
                label="Proveedor"
                value={purchase.supplier?.name ?? "Sin proveedor"}
              />
              <Info
                label="Subtotal"
                value={formatCurrency(Number(purchase.subtotal))}
              />
              <Info
                label="IGV/Impuesto"
                value={formatCurrency(Number(purchase.tax))}
              />
              <Info
                label="Total"
                value={formatCurrency(Number(purchase.total))}
              />
              <Info label="Items" value={purchase.items.length} />
              <Info label="Estado" value={statusLabels[purchase.status]} />
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-medium">Notas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {purchase.notes ?? "Sin notas"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Items comprados</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repuesto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio unitario</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {purchase.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.part ? (
                          <Link
                            href={`/dashboard/parts/${item.part.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.part.name}
                          </Link>
                        ) : (
                          "Repuesto no disponible"
                        )}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.unitPrice))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.total))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit rounded-2xl">
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            className="w-full"
            disabled={!canReceive}
            onClick={handleReceive}
          >
            <PackageCheck className="mr-2 h-4 w-4" />
            Recibir compra
          </Button>

          <Button
            className="w-full"
            disabled={!canCancel}
            variant="destructive"
            onClick={handleCancel}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar compra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string | number;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
