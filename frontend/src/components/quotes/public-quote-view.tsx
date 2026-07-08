"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { quotesService } from "@/services/quotes.service";
import type { Quote } from "@/types/quote";

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

interface PublicQuoteViewProps {
  quote: Quote;
  onRefresh: () => Promise<void>;
}

export function PublicQuoteView({ quote, onRefresh }: PublicQuoteViewProps) {
  async function approve(): Promise<void> {
    try {
      await quotesService.approvePublic(quote.publicToken);
      toast.success("Cotización aprobada correctamente");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function reject(): Promise<void> {
    try {
      await quotesService.rejectPublic(quote.publicToken);
      toast.success("Cotización rechazada");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const canRespond = quote.status === "SENT" || quote.status === "DRAFT";

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3 text-3xl">
              Cotización {quote.code}
              <Badge>{quote.status}</Badge>
            </CardTitle>
            <p className="text-muted-foreground">
              Cliente: {quote.customer?.name ?? "Cliente"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Info
                label="Vehículo"
                value={quote.vehicle?.plate ?? "No registrado"}
              />
              <Info label="Válida hasta" value={formatDate(quote.validUntil)} />
              <Info label="Total" value={formatCurrency(Number(quote.total))} />
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm font-medium">Notas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {quote.notes ?? "Sin notas"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Descuento</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {quote.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.unitPrice))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.discount))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.total))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <Info
                label="Subtotal"
                value={formatCurrency(Number(quote.subtotal))}
              />
              <Info
                label="Descuento"
                value={formatCurrency(Number(quote.discount))}
              />
              <Info
                label="Impuesto"
                value={formatCurrency(Number(quote.tax))}
              />
              <Info label="Total" value={formatCurrency(Number(quote.total))} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:justify-end">
            <Button
              disabled={!canRespond}
              variant="destructive"
              onClick={reject}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rechazar
            </Button>

            <Button disabled={!canRespond} onClick={approve}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprobar cotización
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
