"use client";

import Link from "next/link";
import { Eye, Pencil, Search } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { Quote, QuoteStatus } from "@/types/quote";

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

interface QuoteTableProps {
  quotes: Quote[];
  search: string;
  status: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const statusLabels: Record<QuoteStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CONVERTED: "Convertida",
};

export function QuoteTable({
  quotes,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
}: QuoteTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Buscar por código, cliente o placa..."
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
                <SelectItem value="SENT">Enviada</SelectItem>
                <SelectItem value="APPROVED">Aprobada</SelectItem>
                <SelectItem value="REJECTED">Rechazada</SelectItem>
                <SelectItem value="CONVERTED">Convertida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button asChild>
            <Link href="/dashboard/quotes/new">Nueva cotización</Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando cotizaciones...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && quotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron cotizaciones.
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">
                        {quote.code}
                      </TableCell>

                      <TableCell>
                        {quote.customer?.name ?? "Sin cliente"}
                      </TableCell>

                      <TableCell>
                        {quote.vehicle
                          ? `${quote.vehicle.plate} · ${quote.vehicle.brand} ${quote.vehicle.model}`
                          : "Sin vehículo"}
                      </TableCell>

                      <TableCell>
                        <Badge>{statusLabels[quote.status]}</Badge>
                      </TableCell>

                      <TableCell>
                        {formatCurrency(Number(quote.total))}
                      </TableCell>

                      <TableCell>{formatDate(quote.validUntil)}</TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link href={`/dashboard/quotes/${quote.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            disabled={[
                              "APPROVED",
                              "REJECTED",
                              "CONVERTED",
                            ].includes(quote.status)}
                          >
                            <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
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
