"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Plus,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { MetricCard } from "@/components/common/metric-card";
import { ModuleNote } from "@/components/common/module-note";
import { WorkOrderTable } from "@/components/work-orders/work-order-table";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Métricas compactas para dar mejor visibilidad al módulo
   * sin cambiar la lógica ni consultar endpoints adicionales.
   */
  const stats = useMemo(() => {
    const activeStatuses: WorkOrderStatus[] = [
      "PENDING",
      "RECEIVED",
      "IN_DIAGNOSIS",
      "WAITING_APPROVAL",
      "IN_REPAIR",
      "IN_TESTING",
    ];

    const active = workOrders.filter((order) =>
      activeStatuses.includes(order.status),
    ).length;

    const completed = workOrders.filter((order) =>
      ["COMPLETED", "DELIVERED"].includes(order.status),
    ).length;

    const attention = workOrders.filter((order) =>
      ["WAITING_APPROVAL", "IN_REPAIR", "IN_TESTING"].includes(order.status),
    ).length;

    return {
      total: workOrders.length,
      active,
      completed,
      attention,
    };
  }, [workOrders]);

  async function loadWorkOrders(
    searchValue = search,
    statusValue = status,
  ): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await workOrdersService.findAll({
        search: searchValue || undefined,
        status:
          statusValue !== "ALL" ? (statusValue as WorkOrderStatus) : undefined,
        page: 1,
        limit: 20,
      });

      setWorkOrders(Array.isArray(response.data) ? response.data : []);
    } catch (requestError: unknown) {
      setWorkOrders([]);
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  /*
   * Búsqueda con pequeño delay para no consultar el backend
   * en cada tecla presionada.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadWorkOrders(search, status);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, status]);

  async function handleRefresh(): Promise<void> {
    try {
      setIsRefreshing(true);
      await loadWorkOrders(search, status);
      toast.success("Órdenes actualizadas");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Órdenes de trabajo"
        description="Controla el flujo operativo desde recepción hasta entrega."
        badge="Operaciones"
        icon={ClipboardList}
        actions={
          <>
            <Button
              disabled={isRefreshing}
              type="button"
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>

            <Button asChild>
              <Link href="/dashboard/work-orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nueva orden
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          title="Órdenes"
          value={stats.total}
          description="Vista actual"
          icon={ClipboardList}
        />

        <MetricCard
          title="Activas"
          value={stats.active}
          description="En flujo operativo"
          icon={Wrench}
        />

        <MetricCard
          title="Finalizadas"
          value={stats.completed}
          description="Completadas o entregadas"
          icon={ClipboardList}
        />

        <MetricCard
          title="Seguimiento"
          value={stats.attention}
          description="Requieren atención"
          icon={AlertTriangle}
        />
      </div>

      <ModuleNote
        title="Control operativo"
        description="Los estados se actualizan directamente en backend y se reflejan también en el Kanban."
        icon={Wrench}
        variant="info"
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <WorkOrderTable
        workOrders={workOrders}
        isLoading={isLoading}
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onRefresh={loadWorkOrders}
      />
    </div>
  );
}
