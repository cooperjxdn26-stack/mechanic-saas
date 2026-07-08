"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { quotesService } from "@/services/quotes.service";
import type { Quote } from "@/types/quote";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicQuoteView } from "@/components/quotes/public-quote-view";

export default function PublicQuotePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadQuote(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quotesService.findPublic(token);
      setQuote(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadQuote();
  }, [token]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted/40 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-xl">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  if (!quote) {
    return null;
  }

  return <PublicQuoteView quote={quote} onRefresh={loadQuote} />;
}
