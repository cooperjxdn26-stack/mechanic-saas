"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Receipt,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { invoicesService } from "@/services/invoices.service";
import { quotesService } from "@/services/quotes.service";
import type { Quote, QuoteStatus } from "@/types/quote";

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

interface QuoteDetailProps {
  quote: Quote;
  onRefresh: () => Promise<void>;
}

const statusLabels: Record<QuoteStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CONVERTED: "Convertida",
};

const quoteItemTypeLabels: Record<string, string> = {
  SERVICE: "Servicio",
  PART: "Repuesto",
  LABOR: "Mano de obra",
  EXTRA: "Extra",
};

export function QuoteDetail({ quote, onRefresh }: QuoteDetailProps) {
  const router = useRouter();

  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] =
    useState<boolean>(false);

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/public/quotes/${quote.publicToken}`;
    }

    return `${window.location.origin}/public/quotes/${quote.publicToken}`;
  }, [quote.publicToken]);

  const canEdit =
    quote.status !== "APPROVED" &&
    quote.status !== "REJECTED" &&
    quote.status !== "CONVERTED";

  const canRespond = quote.status === "DRAFT" || quote.status === "SENT";

  const canGenerateInvoice = quote.status === "APPROVED";

  async function handleApprove(): Promise<void> {
    if (!canRespond || isApproving) {
      return;
    }

    try {
      setIsApproving(true);

      /*
       * Esta acción solo aprueba la cotización.
       * La factura se genera después con el botón "Generar factura".
       */
      await quotesService.approve(quote.id);

      toast.success("Cotización aprobada correctamente");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject(): Promise<void> {
    if (!canRespond || isRejecting) {
      return;
    }

    const shouldReject = window.confirm(
      `¿Deseas rechazar la cotización ${quote.code}?`,
    );

    if (!shouldReject) {
      return;
    }

    try {
      setIsRejecting(true);

      await quotesService.reject(quote.id);

      toast.success("Cotización rechazada correctamente");
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsRejecting(false);
    }
  }

  async function handleGenerateInvoice(): Promise<void> {
    if (!canGenerateInvoice || isGeneratingInvoice) {
      return;
    }

    try {
      setIsGeneratingInvoice(true);

      /*
       * Flujo principal:
       * Cotización aprobada -> Factura emitida.
       * El backend valida que la cotización esté aprobada y evita duplicados.
       */
      const invoice = await invoicesService.createFromQuote(quote.id);

      toast.success("Factura generada correctamente");

      router.push(`/dashboard/invoices/${invoice.id}`);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  async function copyPublicLink(): Promise<void> {
    try {
      if (!navigator.clipboard) {
        toast.error("Tu navegador no permite copiar automáticamente");
        return;
      }

      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link público copiado");
    } catch {
      toast.error("No se pudo copiar el link público");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3 text-2xl">
              {quote.code}
              <Badge>{statusLabels[quote.status]}</Badge>
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Creada el {formatDateTime(quote.createdAt)}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Info
                label="Cliente"
                value={quote.customer?.name ?? "Sin cliente"}
              />

              <Info
                label="Vehículo"
                value={
                  quote.vehicle
                    ? `${quote.vehicle.plate} · ${quote.vehicle.brand} ${quote.vehicle.model}`
                    : "Sin vehículo"
                }
              />

              <Info label="Válida hasta" value={formatDate(quote.validUntil)} />

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

              <Info
                label="Aprobada"
                value={
                  quote.approvedAt ? formatDateTime(quote.approvedAt) : "No"
                }
              />

              <Info
                label="Rechazada"
                value={
                  quote.rejectedAt ? formatDateTime(quote.rejectedAt) : "No"
                }
              />
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-medium">Notas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {quote.notes ?? "Sin notas"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Items cotizados</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Descuento</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {quote.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No hay items registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quote.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {quoteItemTypeLabels[item.type] ?? item.type}
                          </Badge>
                        </TableCell>

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
          {canEdit ? (
            <Button asChild className="w-full" variant="outline">
              <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          ) : null}

          {canRespond ? (
            <>
              <Button
                className="w-full"
                disabled={isApproving}
                onClick={handleApprove}
              >
                {isApproving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Aprobar
              </Button>

              <Button
                className="w-full"
                disabled={isRejecting}
                variant="destructive"
                onClick={handleReject}
              >
                {isRejecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Rechazar
              </Button>
            </>
          ) : null}

          {canGenerateInvoice ? (
            <Button
              className="w-full"
              disabled={isGeneratingInvoice}
              onClick={handleGenerateInvoice}
            >
              {isGeneratingInvoice ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Receipt className="mr-2 h-4 w-4" />
              )}
              Generar factura
            </Button>
          ) : null}

          {quote.status === "CONVERTED" ? (
            <div className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
              Esta cotización ya fue convertida en factura.
            </div>
          ) : null}

          <Button className="w-full" variant="outline" onClick={copyPublicLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar link público
          </Button>

          <Button asChild className="w-full" variant="outline">
            <Link href={`/public/quotes/${quote.publicToken}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver pública
            </Link>
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
