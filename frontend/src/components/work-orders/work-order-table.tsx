"use client";

import Link from "next/link";
import { Eye, Pencil, Search, Wrench } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import {
  workOrderStatusLabels,
  workOrderStatusVariants,
} from "@/config/status-styles";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  isLoading: boolean;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => Promise<void>;
}

/*
 * Tipo extendido solo para mostrar relaciones opcionales
 * que pueden venir incluidas desde el backend.
 */
type WorkOrderDisplay = WorkOrder & {
  issueDescription?: string | null;
  customer?: {
    id?: string;
    name?: string | null;
  } | null;
  vehicle?: {
    id?: string;
    plate?: string | null;
    brand?: string | null;
    model?: string | null;
    customer?: {
      id?: string;
      name?: string | null;
    } | null;
  } | null;
};

const workOrderStatusOptions: Array<{
  value: WorkOrderStatus;
  label: string;
}> = [
  { value: "PENDING", label: "Pendiente" },
  { value: "RECEIVED", label: "Recibido" },
  { value: "IN_DIAGNOSIS", label: "Diagnóstico" },
  { value: "WAITING_APPROVAL", label: "Esperando aprobación" },
  { value: "IN_REPAIR", label: "Reparación" },
  { value: "IN_TESTING", label: "Prueba" },
  { value: "COMPLETED", label: "Finalizado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const priorityLabels: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

function getStatusLabel(status: WorkOrderStatus): string {
  return workOrderStatusLabels[status] ?? status;
}

function requiresConfirmation(status: WorkOrderStatus): boolean {
  return status === "DELIVERED" || status === "CANCELLED";
}

export function WorkOrderTable({
  workOrders,
  isLoading,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: WorkOrderTableProps) {
  const displayOrders = workOrders as WorkOrderDisplay[];

  async function handleChangeStatus(
    workOrder: WorkOrderDisplay,
    newStatus: WorkOrderStatus,
  ): Promise<void> {
    if (workOrder.status === newStatus) {
      return;
    }

    /*
     * Confirmamos estados sensibles para evitar cambios accidentales.
     */
    if (requiresConfirmation(newStatus)) {
      const shouldContinue = window.confirm(
        `¿Deseas cambiar la orden ${workOrder.code} a ${getStatusLabel(
          newStatus,
        )}?`,
      );

      if (!shouldContinue) {
        return;
      }
    }

    try {
      /*
       * Enviamos al backend el enum real:
       * RECEIVED, IN_REPAIR, COMPLETED, etc.
       */
      await workOrdersService.changeStatus(workOrder.id, newStatus);

      toast.success(`Estado actualizado a ${getStatusLabel(newStatus)}`);
      await onRefresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Buscar por código, placa, cliente o motivo..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>

            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[260px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>

                {workOrderStatusOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Entrega estimada</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando órdenes...
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && displayOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-4">
                    <EmptyState
                      icon={Wrench}
                      title="No hay órdenes de trabajo"
                      description="Cuando registres una orden, aparecerá aquí y también podrá gestionarse desde el Kanban."
                    />
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading
                ? displayOrders.map((workOrder) => (
                    <TableRow key={workOrder.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{workOrder.code}</p>
                          <p className="text-xs text-muted-foreground">
                            {workOrder.reason ??
                              workOrder.issueDescription ??
                              "Sin motivo"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {workOrder.vehicle?.plate ?? "Sin placa"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {workOrder.vehicle
                              ? `${workOrder.vehicle.brand ?? ""} ${
                                  workOrder.vehicle.model ?? ""
                                }`.trim()
                              : "Sin vehículo"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {workOrder.customer?.name ??
                          workOrder.vehicle?.customer?.name ??
                          "Sin cliente"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {priorityLabels[workOrder.priority] ??
                            workOrder.priority}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <StatusBadge value={workOrder.status} />

                          <Select
                            value={workOrder.status}
                            onValueChange={(value) =>
                              void handleChangeStatus(
                                workOrder,
                                value as WorkOrderStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-[230px]">
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>

                            <SelectContent>
                              {workOrderStatusOptions.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>

                      <TableCell>
                        {workOrder.estimatedDelivery
                          ? formatDateTime(workOrder.estimatedDelivery)
                          : "Sin fecha"}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/dashboard/work-orders/${workOrder.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/dashboard/work-orders/${workOrder.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
