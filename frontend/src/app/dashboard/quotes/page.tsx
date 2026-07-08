"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { quotesService } from "@/services/quotes.service";
import type { Quote, QuoteStatus } from "@/types/quote";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuoteTable } from "@/components/quotes/quote-table";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadQuotes(
    searchValue = search,
    statusValue = status,
  ): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quotesService.findAll({
        search: searchValue || undefined,
        status:
          statusValue !== "ALL" ? (statusValue as QuoteStatus) : undefined,
        page: 1,
        limit: 20,
      });

      setQuotes(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadQuotes(search, status);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
        <p className="mt-1 text-muted-foreground">
          Crea, envía, aprueba y comparte cotizaciones con clientes.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <QuoteTable
        quotes={quotes}
        search={search}
        status={status}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    </div>
  );
}
