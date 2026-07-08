"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { invoicesService } from "@/services/invoices.service";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { InvoiceTable } from "@/components/finance/invoice-table";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInvoices(
    searchValue = search,
    statusValue = status,
  ): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await invoicesService.findAll({
        search: searchValue || undefined,
        status:
          statusValue !== "ALL" ? (statusValue as InvoiceStatus) : undefined,
        page: 1,
        limit: 20,
      });

      setInvoices(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadInvoices(search, status);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
        <p className="mt-1 text-muted-foreground">
          Consulta facturas emitidas, pagos y saldos pendientes.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <InvoiceTable
        invoices={invoices}
        search={search}
        status={status}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    </div>
  );
}
