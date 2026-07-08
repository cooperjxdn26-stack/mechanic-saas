"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { partsService } from "@/services/parts.service";
import type { InventoryMovement } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KardexTable } from "@/components/inventory/kardex-table";

export default function PartKardexPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadKardex(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await partsService.kardex(id);
        setMovements(response.movements);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadKardex();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={`/dashboard/parts/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kardex</h1>
          <p className="mt-1 text-muted-foreground">
            Historial de movimientos del repuesto.
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
        <KardexTable movements={movements} />
      )}
    </div>
  );
}
