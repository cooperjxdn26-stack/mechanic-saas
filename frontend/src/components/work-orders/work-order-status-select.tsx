"use client";

import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrderStatus } from "@/types/work-order";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkOrderStatusSelectProps {
  workOrderId: string;
  value: WorkOrderStatus;
  disabled?: boolean;
  onChanged?: () => Promise<void> | void;
}

const statusOptions: Array<{ value: WorkOrderStatus; label: string }> = [
  { value: "PENDING", label: "Pendiente" },
  { value: "RECEIVED", label: "Recibido" },
  { value: "IN_DIAGNOSIS", label: "En diagnóstico" },
  { value: "WAITING_APPROVAL", label: "Esperando aprobación" },
  { value: "IN_REPAIR", label: "En reparación" },
  { value: "IN_TESTING", label: "En prueba" },
  { value: "COMPLETED", label: "Finalizado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

export function WorkOrderStatusSelect({
  workOrderId,
  value,
  disabled = false,
  onChanged,
}: WorkOrderStatusSelectProps) {
  async function handleChange(nextStatus: WorkOrderStatus): Promise<void> {
    if (nextStatus === value) {
      return;
    }

    try {
      /*
       * El backend espera un objeto:
       * {
       *   status: "RECEIVED",
       *   notes?: "..."
       * }
       *
       * No enviamos el texto visible. Enviamos el enum real.
       */
      await workOrdersService.changeStatus(workOrderId, {
        status: nextStatus,
        notes: `Cambio de estado desde frontend: ${value} → ${nextStatus}`,
      });

      toast.success("Estado actualizado correctamente");

      /*
       * Refrescamos la lista o detalle si el componente padre lo necesita.
       */
      await onChanged?.();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(next) => void handleChange(next as WorkOrderStatus)}
    >
      <SelectTrigger className="w-47.5">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>

      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
