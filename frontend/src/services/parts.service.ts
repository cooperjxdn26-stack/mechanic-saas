import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateInventoryMovementPayload,
  CreatePartPayload,
  InventoryMovementResult,
  KardexResponse,
  Part,
  PartQueryParams,
  UpdatePartPayload,
} from "@/types/inventory";

function buildPartQuery(params?: PartQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.brand) searchParams.set("brand", params.brand);
  if (params.supplierId) searchParams.set("supplierId", params.supplierId);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (typeof params.lowStock === "boolean") {
    searchParams.set("lowStock", String(params.lowStock));
  }
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const partsService = {
  async findAll(params?: PartQueryParams): Promise<PaginatedResponse<Part>> {
    const query = buildPartQuery(params);

    const response = await api.get<PaginatedResponse<Part>>(`/parts${query}`);

    return response.data;
  },

  async findOne(id: string): Promise<Part> {
    const response = await api.get<Part>(`/parts/${id}`);
    return response.data;
  },

  async create(payload: CreatePartPayload): Promise<Part> {
    const response = await api.post<Part>("/parts", payload);
    return response.data;
  },

  async update(id: string, payload: UpdatePartPayload): Promise<Part> {
    const response = await api.patch<Part>(`/parts/${id}`, payload);
    return response.data;
  },

  async deactivate(id: string): Promise<Part> {
    const response = await api.delete<Part>(`/parts/${id}`);
    return response.data;
  },

  async createMovement(
    id: string,
    payload: CreateInventoryMovementPayload,
  ): Promise<InventoryMovementResult> {
    const response = await api.post<InventoryMovementResult>(
      `/parts/${id}/movements`,
      payload,
    );

    return response.data;
  },

  async kardex(id: string): Promise<KardexResponse> {
    const response = await api.get<KardexResponse>(`/parts/${id}/kardex`);
    return response.data;
  },

  async lowStock(): Promise<Part[]> {
    const response = await api.get<Part[]>("/parts/low-stock");
    return response.data;
  },
};
