"use client";

import { Search } from "lucide-react";

import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Payment } from "@/types/payment";

import { Badge } from "@/components/ui/badge";
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

interface PaymentTableProps {
  payments: Payment[];
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
}

export function PaymentTable({
  payments,
  search,
  isLoading,
  onSearchChange,
}: PaymentTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar pago, referencia o cliente..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando pagos...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron pagos.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.code}
                      </TableCell>
                      <TableCell>
                        {payment.customer?.name ?? "Sin cliente"}
                      </TableCell>
                      <TableCell>
                        {payment.invoice?.code ?? "Sin factura"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.method}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(payment.amount))}
                      </TableCell>
                      <TableCell>
                        {payment.reference ?? "Sin referencia"}
                      </TableCell>
                      <TableCell>{formatDateTime(payment.paidAt)}</TableCell>
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
