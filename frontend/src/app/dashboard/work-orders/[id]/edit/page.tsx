"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrder } from "@/types/work-order";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkOrderForm } from "@/components/work-orders/work-order-form";

export default function EditWorkOrderPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkOrder(): Promise<void> {
      if (!id) {
        setError("ID de orden inválido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await workOrdersService.findOne(id);
        setWorkOrder(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadWorkOrder();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.workOrders}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar orden</h1>
          <p className="mt-1 text-muted-foreground">
            Actualiza datos generales de la orden.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && workOrder ? (
        <WorkOrderForm workOrder={workOrder} mode="edit" />
      ) : null}
    </div>
  );
}
