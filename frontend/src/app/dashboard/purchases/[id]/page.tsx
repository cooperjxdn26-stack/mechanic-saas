"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { purchasesService } from "@/services/purchases.service";
import type { Purchase } from "@/types/purchase";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseDetail } from "@/components/purchases/purchase-detail";

export default function PurchaseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPurchase(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await purchasesService.findOne(id);
      setPurchase(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPurchase();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/purchases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de compra
          </h1>
          <p className="mt-1 text-muted-foreground">
            Revisa items, proveedor, total y estado de recepción.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && purchase ? (
        <PurchaseDetail purchase={purchase} onRefresh={loadPurchase} />
      ) : null}
    </div>
  );
}
