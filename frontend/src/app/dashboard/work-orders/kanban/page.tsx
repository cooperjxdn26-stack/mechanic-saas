"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  workOrderStatusLabels,
  workOrderStatusVariants,
} from "@/config/status-styles";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/page-header";
import { ModuleNote } from "@/components/common/module-note";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";

type KanbanWorkOrder = WorkOrder & {
  issueDescription?: string | null;
  customer?: {
    name?: string | null;
  } | null;
  vehicle?: {
    plate?: string | null;
    brand?: string | null;
    model?: string | null;
    customer?: {
      name?: string | null;
    } | null;
  } | null;
};

interface KanbanColumnConfig {
  status: WorkOrderStatus;
  title: string;
  description: string;
}

const kanbanColumns: KanbanColumnConfig[] = [
  { status: "PENDING", title: "Pendiente", description: "Órdenes creadas" },
  { status: "RECEIVED", title: "Recibido", description: "Vehículo recibido" },
  {
    status: "IN_DIAGNOSIS",
    title: "Diagnóstico",
    description: "Revisión técnica",
  },
  {
    status: "WAITING_APPROVAL",
    title: "Aprobación",
    description: "Esperando aprobación",
  },
  {
    status: "IN_REPAIR",
    title: "Reparación",
    description: "Trabajo en curso",
  },
  { status: "IN_TESTING", title: "Prueba", description: "Control final" },
  {
    status: "COMPLETED",
    title: "Finalizado",
    description: "Trabajo terminado",
  },
  {
    status: "DELIVERED",
    title: "Entregado",
    description: "Vehículo entregado",
  },
];

const validStatuses = kanbanColumns.map((column) => column.status);

const priorityLabels: Record<string, string> = {
  LOW: "BAJA",
  MEDIUM: "MEDIA",
  HIGH: "ALTA",
  URGENT: "URGENTE",
};

function requiresConfirmation(status: WorkOrderStatus): boolean {
  return status === "COMPLETED" || status === "DELIVERED";
}

export default function WorkOrdersKanbanPage() {
  const [orders, setOrders] = useState<KanbanWorkOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<KanbanWorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  /*
   * Agrupa órdenes por columna visible.
   */
  const groupedOrders = useMemo(() => {
    const grouped: Partial<Record<WorkOrderStatus, KanbanWorkOrder[]>> = {};

    for (const column of kanbanColumns) {
      grouped[column.status] = [];
    }

    for (const order of orders) {
      if (validStatuses.includes(order.status)) {
        grouped[order.status]?.push(order);
      }
    }

    return grouped;
  }, [orders]);

  const totalVisibleOrders = useMemo(() => {
    return kanbanColumns.reduce((acc, column) => {
      return acc + (groupedOrders[column.status]?.length ?? 0);
    }, 0);
  }, [groupedOrders]);

  const loadOrders = useCallback(async (showToast = false): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await workOrdersService.findAll({
        page: 1,
        limit: 100,
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data as KanbanWorkOrder[]);

      if (showToast) {
        toast.success("Kanban actualizado");
      }
    } catch (requestError: unknown) {
      setOrders([]);
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleRefresh(): Promise<void> {
    try {
      setIsRefreshing(true);
      await loadOrders(true);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleDragStart(event: DragStartEvent): void {
    const orderId = String(event.active.id);
    const order = orders.find((item) => item.id === orderId) ?? null;

    setActiveOrder(order);
  }

  async function handleDragEnd(event: DragEndEvent): Promise<void> {
    const orderId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;

    setActiveOrder(null);

    if (!overId) {
      return;
    }

    if (!validStatuses.includes(overId as WorkOrderStatus)) {
      return;
    }

    const newStatus = overId as WorkOrderStatus;
    const currentOrder = orders.find((item) => item.id === orderId);

    if (!currentOrder || currentOrder.status === newStatus) {
      return;
    }

    /*
     * Confirmación para finalizar o entregar.
     */
    if (requiresConfirmation(newStatus)) {
      const shouldMove = window.confirm(
        `¿Deseas mover la orden ${currentOrder.code} a ${
          workOrderStatusLabels[newStatus] ?? newStatus
        }?`,
      );

      if (!shouldMove) {
        return;
      }
    }

    const previousOrders = orders;

    /*
     * Actualización optimista:
     * primero movemos la tarjeta visualmente.
     */
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === currentOrder.id
          ? {
              ...order,
              status: newStatus,
            }
          : order,
      ),
    );

    try {
      await workOrdersService.changeStatus(currentOrder.id, newStatus);

      toast.success(
        `Orden movida a ${workOrderStatusLabels[newStatus] ?? newStatus}`,
      );
    } catch (requestError: unknown) {
      setOrders(previousOrders);
      toast.error(getApiErrorMessage(requestError));
    }
  }

  function handleDragCancel(): void {
    setActiveOrder(null);
  }

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kanban de órdenes"
        description="Mueve órdenes entre estados y controla el flujo operativo del taller."
        badge={`${totalVisibleOrders} órdenes`}
        icon={ClipboardList}
        actions={
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
        }
      />

      <ModuleNote
        title="Movimiento de estados"
        description="Arrastra una orden hacia otra columna para actualizar su estado. El cambio se guarda en backend."
        icon={Wrench}
        variant="info"
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <KanbanSkeleton />
      ) : totalVisibleOrders === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No hay órdenes en el Kanban"
          description="Cuando registres órdenes de trabajo, aparecerán agrupadas por estado operativo."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid gap-4 overflow-x-auto pb-3 xl:grid-cols-4">
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.status}
                column={column}
                orders={groupedOrders[column.status] ?? []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeOrder ? <OrderCard order={activeOrder} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

interface KanbanColumnProps {
  column: KanbanColumnConfig;
  orders: KanbanWorkOrder[];
}

function KanbanColumn({ column, orders }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[300px] rounded-2xl border bg-muted/20 p-4 transition ${
        isOver ? "border-orange-400 bg-orange-50" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1">
            <StatusBadge value={column.status} />
          </div>

          <p className="text-xs text-muted-foreground">{column.description}</p>
        </div>

        <Badge variant="outline">{orders.length}</Badge>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-background p-4 text-center text-sm text-muted-foreground">
            Sin órdenes
          </div>
        ) : (
          orders.map((order) => (
            <DraggableOrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </section>
  );
}

interface DraggableOrderCardProps {
  order: KanbanWorkOrder;
}

function DraggableOrderCard({ order }: DraggableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: order.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <OrderCard order={order} isDragging={isDragging} />
    </div>
  );
}

interface OrderCardProps {
  order: KanbanWorkOrder;
  isDragging?: boolean;
  isOverlay?: boolean;
}

function OrderCard({
  order,
  isDragging = false,
  isOverlay = false,
}: OrderCardProps) {
  const description =
    order.issueDescription ?? order.reason ?? "Sin descripción";

  const plate = order.vehicle?.plate ?? "Sin placa";

  const customerName =
    order.customer?.name ?? order.vehicle?.customer?.name ?? "Sin cliente";

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleString("es-PE")
    : "Sin fecha";

  return (
    <div
      className={`rounded-2xl border bg-background p-4 shadow-sm transition ${
        isDragging || isOverlay ? "opacity-80 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-semibold">{order.code}</p>

        <Badge>{priorityLabels[order.priority] ?? order.priority}</Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <p>{plate}</p>
        <p>{customerName}</p>
        <p>Entrega: {estimatedDelivery}</p>
      </div>

      {!isOverlay ? (
        <div className="mt-3 flex justify-end">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/work-orders/${order.id}`}>
              <Eye className="mr-2 h-3.5 w-3.5" />
              Ver
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-64 rounded-2xl" />
      ))}
    </div>
  );
}
