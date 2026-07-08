import { api } from "@/lib/api";
import type {
  ChangeWorkOrderStatusPayload,
  CreateChecklistItemPayload,
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  WorkOrder,
  WorkOrderKanbanColumn,
  WorkOrderQueryParams,
  WorkOrderStats,
  WorkOrderStatus,
  WorkOrderTimeline,
} from "@/types/work-order";

interface PaginatedWorkOrdersResponse {
  data: WorkOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export const workOrdersService = {
  /*
   * Lista órdenes con filtros y paginación.
   */
  async findAll(
    params?: WorkOrderQueryParams,
  ): Promise<PaginatedWorkOrdersResponse> {
    const response = await api.get<PaginatedWorkOrdersResponse>(
      "/work-orders",
      {
        params,
      },
    );

    return response.data;
  },

  /*
   * Obtiene detalle completo de una orden.
   * Esta función es la que debe usar:
   * /dashboard/work-orders/[id]/page.tsx
   */
  async findOne(id: string): Promise<WorkOrder> {
    const response = await api.get<WorkOrder>(`/work-orders/${id}`);
    return response.data;
  },

  /*
   * Alias seguro por si algún componente antiguo llama getById.
   */
  async getById(id: string): Promise<WorkOrder> {
    return this.findOne(id);
  },

  /*
   * Crea una orden.
   */
  async create(payload: CreateWorkOrderPayload): Promise<WorkOrder> {
    const response = await api.post<WorkOrder>("/work-orders", payload);
    return response.data;
  },

  /*
   * Actualiza datos generales de una orden.
   */
  async update(
    id: string,
    payload: UpdateWorkOrderPayload,
  ): Promise<WorkOrder> {
    const response = await api.patch<WorkOrder>(`/work-orders/${id}`, payload);

    return response.data;
  },

  /*
   * Cambia estado.
   *
   * El backend espera:
   * {
   *   status: "RECEIVED",
   *   notes?: "..."
   * }
   *
   * También soportamos que algún componente antiguo mande solo:
   * "RECEIVED"
   */
  async changeStatus(
    id: string,
    payload: WorkOrderStatus | ChangeWorkOrderStatusPayload,
  ): Promise<WorkOrder> {
    const body: ChangeWorkOrderStatusPayload =
      typeof payload === "string"
        ? {
            status: payload,
          }
        : payload;

    const response = await api.patch<WorkOrder>(
      `/work-orders/${id}/status`,
      body,
    );

    return response.data;
  },

  /*
   * Estadísticas rápidas.
   */
  async getStats(branchId?: string): Promise<WorkOrderStats> {
    const response = await api.get<WorkOrderStats>("/work-orders/stats", {
      params: {
        branchId,
      },
    });

    return response.data;
  },

  /*
   * Datos para Kanban.
   */
  async getKanban(branchId?: string): Promise<WorkOrderKanbanColumn[]> {
    const response = await api.get<WorkOrderKanbanColumn[]>(
      "/work-orders/kanban",
      {
        params: {
          branchId,
        },
      },
    );

    return response.data;
  },

  /*
   * Timeline completo de una orden.
   */
  async getTimeline(id: string): Promise<WorkOrderTimeline> {
    const response = await api.get<WorkOrderTimeline>(
      `/work-orders/${id}/timeline`,
    );

    return response.data;
  },

  /*
   * Agrega item al checklist.
   */
  async addChecklistItem(
    id: string,
    payload: CreateChecklistItemPayload,
  ): Promise<WorkOrder> {
    const response = await api.post<WorkOrder>(
      `/work-orders/${id}/checklist`,
      payload,
    );

    return response.data;
  },

  /*
   * Actualiza item del checklist.
   */
  async updateChecklistItem(
    checklistId: string,
    payload: CreateChecklistItemPayload,
  ): Promise<WorkOrder> {
    const response = await api.patch<WorkOrder>(
      `/work-orders/checklist/${checklistId}`,
      payload,
    );

    return response.data;
  },
};
