import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreatePurchasePayload,
  Purchase,
  PurchaseQueryParams,
  UpdatePurchasePayload,
} from "@/types/purchase";

function buildPurchaseQuery(params?: PurchaseQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.supplierId) searchParams.set("supplierId", params.supplierId);
  if (params.branchId) searchParams.set("branchId", params.branchId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const purchasesService = {
  async findAll(
    params?: PurchaseQueryParams,
  ): Promise<PaginatedResponse<Purchase>> {
    const query = buildPurchaseQuery(params);

    const response = await api.get<PaginatedResponse<Purchase>>(
      `/purchases${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Purchase> {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    return response.data;
  },

  async create(payload: CreatePurchasePayload): Promise<Purchase> {
    const response = await api.post<Purchase>("/purchases", payload);
    return response.data;
  },

  async update(id: string, payload: UpdatePurchasePayload): Promise<Purchase> {
    const response = await api.patch<Purchase>(`/purchases/${id}`, payload);
    return response.data;
  },

  async receive(id: string): Promise<Purchase> {
    const response = await api.patch<Purchase>(`/purchases/${id}/receive`);
    return response.data;
  },

  async cancel(id: string): Promise<Purchase> {
    const response = await api.patch<Purchase>(`/purchases/${id}/cancel`);
    return response.data;
  },
};
