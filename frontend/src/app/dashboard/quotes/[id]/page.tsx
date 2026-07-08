"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { quotesService } from "@/services/quotes.service";
import type { Quote } from "@/types/quote";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteDetail } from "@/components/quotes/quote-detail";

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadQuote(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quotesService.findOne(id);
      setQuote(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadQuote();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/quotes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de cotización
          </h1>
          <p className="mt-1 text-muted-foreground">
            Revisa montos, items, cliente y aprobación.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && quote ? (
        <QuoteDetail quote={quote} onRefresh={loadQuote} />
      ) : null}
    </div>
  );
}
