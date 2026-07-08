"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { diagnosticsService } from "@/services/diagnostics.service";
import type { Diagnostic } from "@/types/diagnostic";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { DiagnosticForm } from "@/components/work-orders/diagnostic-form";
import { DiagnosticList } from "@/components/work-orders/diagnostic-list";

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDiagnostics(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await diagnosticsService.findAll();
      setDiagnostics(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDiagnostics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Diagnósticos</h1>
        <p className="mt-1 text-muted-foreground">
          Registra y consulta diagnósticos técnicos de las órdenes de trabajo.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <DiagnosticForm onCreated={loadDiagnostics} />

      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : (
        <DiagnosticList
          diagnostics={diagnostics}
          allowDelete
          onDeleted={loadDiagnostics}
        />
      )}
    </div>
  );
}
