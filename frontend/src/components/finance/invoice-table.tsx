"use client";

import Link from "next/link";
import { Eye, Search } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

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

interface InvoiceTableProps {
  invoices: Invoice[];
  search: string;
  status: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const statusLabels: Record<InvoiceStatus, string> = {
  ISSUED: "Emitida",
  PAID: "Pagada",
  PARTIALLY_PAID: "Pago parcial",
  CANCELLED: "Anulada",
};

export function InvoiceTable({
  invoices,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
}: InvoiceTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Buscar factura o cliente..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>

            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="ISSUED">Emitida</SelectItem>
                <SelectItem value="PAID">Pagada</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Pago parcial</SelectItem>
                <SelectItem value="CANCELLED">Anulada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Emitida</TableHead>
                <TableHead className="w-[80px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando facturas...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron facturas.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? invoices.map((invoice) => {
                    const paid =
                      invoice.payments?.reduce((acc, payment) => {
                        return acc + Number(payment.amount);
                      }, 0) ?? 0;

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.code}
                        </TableCell>

                        <TableCell>
                          {invoice.customer?.name ?? "Sin cliente"}
                        </TableCell>

                        <TableCell>
                          <Badge>{statusLabels[invoice.status]}</Badge>
                        </TableCell>

                        <TableCell>
                          {formatCurrency(Number(invoice.total))}
                        </TableCell>

                        <TableCell>{formatCurrency(paid)}</TableCell>

                        <TableCell>{formatDate(invoice.issuedAt)}</TableCell>

                        <TableCell className="text-right">
                          <Button asChild size="icon" variant="ghost">
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
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
