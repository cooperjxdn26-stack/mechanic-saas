"use client";

import Link from "next/link";

import { routes } from "@/config/routes";
import { formatDateTime } from "@/lib/format";
import type {
  WorkOrderKanbanColumn,
  WorkOrderStatus,
} from "@/types/work-order";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkOrderKanbanProps {
  columns: WorkOrderKanbanColumn[];
}

const statusLabels: Record<WorkOrderStatus, string> = {
  PENDING: "Pendiente",
  RECEIVED: "Recibido",
  IN_DIAGNOSIS: "Diagnóstico",
  WAITING_APPROVAL: "Esperando aprobación",
  IN_REPAIR: "Reparación",
  IN_TESTING: "Prueba",
  COMPLETED: "Finalizado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function WorkOrderKanban({ columns }: WorkOrderKanbanProps) {
  return (
    <div className="grid gap-4 overflow-x-auto xl:grid-cols-3 2xl:grid-cols-4">
      {columns.map((column) => (
        <Card key={column.status} className="min-h-105 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              {statusLabels[column.status]}
              <Badge variant="outline">{column.count}</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {column.orders.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Sin órdenes
              </div>
            ) : (
              column.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`${routes.workOrders}/${order.id}`}
                  className="block rounded-xl border bg-background p-4 shadow-sm transition hover:bg-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{order.code}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {order.reason}
                      </p>
                    </div>

                    <Badge>{order.priority}</Badge>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>{order.vehicle?.plate ?? "Sin placa"}</p>
                    <p>{order.vehicle?.customer?.name ?? "Sin cliente"}</p>
                    <p>Entrega: {formatDateTime(order.estimatedDelivery)}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
