"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { partsService } from "@/services/parts.service";
import type { Part } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { PartTable } from "@/components/inventory/part-table";

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadParts(searchValue = search): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partsService.findAll({
        search: searchValue || undefined,
        page: 1,
        limit: 20,
      });

      setParts(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadParts(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

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
      await loadParts();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repuestos</h1>
        <p className="mt-1 text-muted-foreground">
          Controla stock, precios, ubicación y alertas de inventario.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <PartTable
        parts={parts}
        search={search}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}
