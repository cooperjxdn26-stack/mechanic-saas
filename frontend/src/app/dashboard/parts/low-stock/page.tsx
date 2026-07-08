"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { partsService } from "@/services/parts.service";
import type { Part } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PartTable } from "@/components/inventory/part-table";

export default function LowStockPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLowStock(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partsService.lowStock();
      setParts(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadLowStock();
  }, []);

  async function handleDeactivate(part: Part): Promise<void> {
    const shouldDeactivate = window.confirm(
      `¿Deseas desactivar el repuesto "${part.name}"?`,
    );

    if (!shouldDeactivate) {
      return;
    }

    try {
      await partsService.deactivate(part.id);
      toast.success("Repuesto desactivado");
      await loadLowStock();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  const filteredParts = parts.filter((part) => {
    const term = search.toLowerCase();

    return (
      part.name.toLowerCase().includes(term) ||
      (part.sku ?? "").toLowerCase().includes(term) ||
      (part.brand ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/parts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock bajo</h1>
          <p className="mt-1 text-muted-foreground">
            Repuestos que necesitan reposición.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : (
        <PartTable
          parts={filteredParts}
          search={search}
          isLoading={false}
          onSearchChange={setSearch}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
}
