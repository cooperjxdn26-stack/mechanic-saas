"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Wrench,
} from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { reportsService } from "@/services/reports.service";
import type { WorkOrdersReport } from "@/types/report";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/report-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    RECEIVED: "Recibida",
    IN_DIAGNOSIS: "En diagnóstico",
    WAITING_APPROVAL: "Esperando aprobación",
    IN_REPAIR: "En reparación",
    IN_TESTING: "En pruebas",
    COMPLETED: "Completada",
    DELIVERED: "Entregada",
    CANCELLED: "Cancelada",
  };

  return labels[status] ?? status;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    URGENT: "Urgente",
  };

  return labels[priority] ?? priority;
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "COMPLETED" || status === "DELIVERED") {
    return "secondary";
  }

  if (status === "CANCELLED") {
    return "destructive";
  }

  if (status === "IN_REPAIR" || status === "IN_DIAGNOSIS") {
    return "default";
  }

  return "outline";
}

export default function WorkOrdersReportPage() {
  const [report, setReport] = useState<WorkOrdersReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * El backend devuelve:
         * summary.total
         * summary.byStatus
         * rows
         */
        const response = await reportsService.workOrders();

        setReport(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadReport();
  }, []);

  /*
   * Valores seguros para evitar undefined o NaN.
   */
  const totalOrders = Number(report?.summary?.total ?? 0);

  const completedOrders =
    Number(report?.summary?.byStatus?.COMPLETED ?? 0) +
    Number(report?.summary?.byStatus?.DELIVERED ?? 0);

  const activeOrders =
    Number(report?.summary?.byStatus?.PENDING ?? 0) +
    Number(report?.summary?.byStatus?.RECEIVED ?? 0) +
    Number(report?.summary?.byStatus?.IN_DIAGNOSIS ?? 0) +
    Number(report?.summary?.byStatus?.WAITING_APPROVAL ?? 0) +
    Number(report?.summary?.byStatus?.IN_REPAIR ?? 0) +
    Number(report?.summary?.byStatus?.IN_TESTING ?? 0);

  /*
   * Órdenes atrasadas:
   * Si estimatedDelivery ya pasó y la orden no está completada, entregada o cancelada.
   */
  const overdueOrders =
    report?.rows?.filter((order) => {
      if (!order.estimatedDelivery) {
        return false;
      }

      const deliveryDate = new Date(order.estimatedDelivery);
      const now = new Date();

      const finishedStatuses = ["COMPLETED", "DELIVERED", "CANCELLED"];

      return deliveryDate < now && !finishedStatuses.includes(order.status);
    }).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporte de órdenes
        </h1>
        <p className="mt-1 text-muted-foreground">
          Órdenes activas, completadas y atrasadas.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title="Total órdenes"
              value={totalOrders}
              description="Órdenes registradas"
              icon={ClipboardList}
            />

            <ReportCard
              title="Completadas"
              value={completedOrders}
              description="Finalizadas o entregadas"
              icon={CheckCircle}
            />

            <ReportCard
              title="Activas"
              value={activeOrders}
              description="En proceso de atención"
              icon={Wrench}
            />

            <ReportCard
              title="Atrasadas"
              value={overdueOrders}
              description="Con entrega vencida"
              icon={AlertTriangle}
            />
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Mecánico</TableHead>
                      <TableHead>Recepción</TableHead>
                      <TableHead>Entrega estimada</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {report.rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No hay datos de órdenes.
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.rows.map((order) => (
                        <TableRow key={order.code}>
                          <TableCell className="font-medium">
                            {order.code}
                          </TableCell>

                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">
                              {getPriorityLabel(order.priority)}
                            </Badge>
                          </TableCell>

                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.vehicle}</TableCell>
                          <TableCell>{order.plate}</TableCell>
                          <TableCell>{order.mechanic ?? "-"}</TableCell>

                          <TableCell>
                            {order.receivedAt
                              ? formatDateTime(order.receivedAt as any)
                              : "-"}
                          </TableCell>

                          <TableCell>
                            {order.estimatedDelivery
                              ? formatDateTime(order.estimatedDelivery as any)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
