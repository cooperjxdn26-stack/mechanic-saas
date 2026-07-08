"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { purchasesService } from "@/services/purchases.service";
import type { Purchase, PurchaseStatus } from "@/types/purchase";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseTable } from "@/components/purchases/purchase-table";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPurchases(
    searchValue = search,
    statusValue = status,
  ): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await purchasesService.findAll({
        search: searchValue || undefined,
        status:
          statusValue !== "ALL" ? (statusValue as PurchaseStatus) : undefined,
        page: 1,
        limit: 20,
      });

      setPurchases(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadPurchases(search, status);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona compras de repuestos y entradas automáticas de stock.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <PurchaseTable
        purchases={purchases}
        search={search}
        status={status}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    </div>
  );
}
