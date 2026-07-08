"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { paymentsService } from "@/services/payments.service";
import type { Payment } from "@/types/payment";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PaymentTable } from "@/components/finance/payment-table";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments(searchValue = search): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await paymentsService.findAll({
        search: searchValue || undefined,
        page: 1,
        limit: 20,
      });

      setPayments(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadPayments(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
          <p className="mt-1 text-muted-foreground">
            Registra y consulta pagos por método, factura o cliente.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/payments/new">Nuevo pago</Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <PaymentTable
        payments={payments}
        search={search}
        isLoading={isLoading}
        onSearchChange={setSearch}
      />
    </div>
  );
}
