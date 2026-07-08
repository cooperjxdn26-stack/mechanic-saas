"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { invoicesService } from "@/services/invoices.service";
import type { Invoice } from "@/types/invoice";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceDetail } from "@/components/finance/invoice-detail";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInvoice(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await invoicesService.findOne(id);
      setInvoice(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadInvoice();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de factura
          </h1>
          <p className="mt-1 text-muted-foreground">
            Montos, pagos y saldo pendiente.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && invoice ? (
        <InvoiceDetail invoice={invoice} onRefresh={loadInvoice} />
      ) : null}
    </div>
  );
}
