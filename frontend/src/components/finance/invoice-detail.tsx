"use client";

import Link from "next/link";
import { Ban, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { invoicesService } from "@/services/invoices.service";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

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

interface InvoiceDetailProps {
  invoice: Invoice;
  onRefresh: () => Promise<void>;
}

const statusLabels: Record<InvoiceStatus, string> = {
  ISSUED: "Emitida",
  PAID: "Pagada",
  PARTIALLY_PAID: "Pago parcial",
  CANCELLED: "Anulada",
};

export function InvoiceDetail({ invoice, onRefresh }: InvoiceDetailProps) {
  const paid =
    invoice.payments?.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0) ?? 0;

  const total = Number(invoice.total);
  const remaining = total - paid;

  async function cancelInvoice(): Promise<void> {
    const shouldCancel = window.confirm(
      "¿Deseas anular esta factura? Esta acción mantiene trazabilidad.",
    );

    if (!shouldCancel) {
      return;
    }

    try {
      await invoicesService.cancel(invoice.id);
      toast.success("Factura anulada");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3 text-2xl">
              {invoice.code}
              <Badge>{statusLabels[invoice.status]}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Emitida el {formatDateTime(invoice.issuedAt)}
            </p>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            <Info
              label="Cliente"
              value={invoice.customer?.name ?? "Sin cliente"}
            />
            <Info
              label="Subtotal"
              value={formatCurrency(Number(invoice.subtotal))}
            />
            <Info
              label="Descuento"
              value={formatCurrency(Number(invoice.discount))}
            />
            <Info
              label="Impuesto"
              value={formatCurrency(Number(invoice.tax))}
            />
            <Info label="Total" value={formatCurrency(total)} />
            <Info label="Pagado" value={formatCurrency(paid)} />
            <Info
              label="Saldo"
              value={formatCurrency(Math.max(remaining, 0))}
            />
            <Info
              label="Cotización"
              value={invoice.quote?.code ?? "Sin cotización"}
            />
            <Info
              label="Orden"
              value={invoice.workOrder?.code ?? "Sin orden"}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Pagos registrados</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {!invoice.payments || invoice.payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No hay pagos registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoice.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.code}
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                        <TableCell>
                          {payment.reference ?? "Sin referencia"}
                        </TableCell>
                        <TableCell>{formatDateTime(payment.paidAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
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
            asChild
            className="w-full"
            disabled={invoice.status === "CANCELLED"}
          >
            <Link href={`/dashboard/payments/new?invoiceId=${invoice.id}`}>
              <CreditCard className="mr-2 h-4 w-4" />
              Registrar pago
            </Link>
          </Button>

          <Button
            className="w-full"
            disabled={invoice.status === "CANCELLED"}
            variant="destructive"
            onClick={cancelInvoice}
          >
            <Ban className="mr-2 h-4 w-4" />
            Anular factura
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
