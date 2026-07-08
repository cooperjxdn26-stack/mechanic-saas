"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { diagnosticsService } from "@/services/diagnostics.service";
import { workOrdersService } from "@/services/work-orders.service";
import type { Diagnostic } from "@/types/diagnostic";
import type { WorkOrder, WorkOrderTimeline } from "@/types/work-order";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChecklistForm } from "@/components/work-orders/checklist-form";
import { DiagnosticForm } from "@/components/work-orders/diagnostic-form";
import { DiagnosticList } from "@/components/work-orders/diagnostic-list";
import { Timeline } from "@/components/work-orders/timeline";
import { WorkOrderDetail } from "@/components/work-orders/work-order-detail";

export default function WorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [timeline, setTimeline] = useState<WorkOrderTimeline | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Carga toda la información necesaria para el detalle de orden.
   *
   * useCallback evita el warning de React:
   * "React Hook useEffect has a missing dependency".
   */
  const loadWorkOrder = useCallback(async (): Promise<void> => {
    if (!id) {
      setError("ID de orden inválido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      /*
       * Cargamos en paralelo:
       * - Detalle principal de la orden.
       * - Timeline completo de la orden.
       * - Diagnósticos asociados.
       *
       * Importante:
       * En workOrdersService el método correcto es getTimeline(id),
       * no timeline(id).
       */
      const [orderResponse, timelineResponse, diagnosticsResponse] =
        await Promise.all([
          workOrdersService.findOne(id),
          workOrdersService.getTimeline(id),
          diagnosticsService.findAll(id),
        ]);

      setWorkOrder(orderResponse);
      setTimeline(timelineResponse);
      setDiagnostics(diagnosticsResponse);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /*
   * Ejecuta la carga inicial y se vuelve a ejecutar si cambia el ID.
   */
  useEffect(() => {
    void loadWorkOrder();
  }, [loadWorkOrder]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.workOrders}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de orden
          </h1>
          <p className="mt-1 text-muted-foreground">
            Diagnóstico, checklist, estado y avance de reparación.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : null}

      {!isLoading && workOrder ? (
        <>
          <WorkOrderDetail workOrder={workOrder} onRefresh={loadWorkOrder} />

          <DiagnosticForm
            workOrderId={workOrder.id}
            onCreated={loadWorkOrder}
          />

          <DiagnosticList
            diagnostics={diagnostics}
            allowDelete
            onDeleted={loadWorkOrder}
          />

          <ChecklistForm workOrderId={workOrder.id} onCreated={loadWorkOrder} />

          {timeline ? <Timeline timeline={timeline} /> : null}
        </>
      ) : null}
    </div>
  );
}
