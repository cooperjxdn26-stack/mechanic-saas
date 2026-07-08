import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateSupplierPayload,
  Supplier,
  SupplierQueryParams,
  UpdateSupplierPayload,
} from "@/types/supplier";

function buildSupplierQuery(params?: SupplierQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const suppliersService = {
  async findAll(
    params?: SupplierQueryParams,
  ): Promise<PaginatedResponse<Supplier>> {
    const query = buildSupplierQuery(params);

    const response = await api.get<PaginatedResponse<Supplier>>(
      `/suppliers${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Supplier> {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  async create(payload: CreateSupplierPayload): Promise<Supplier> {
    const response = await api.post<Supplier>("/suppliers", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateSupplierPayload): Promise<Supplier> {
    const response = await api.patch<Supplier>(`/suppliers/${id}`, payload);
    return response.data;
  },

  async deactivate(id: string): Promise<Supplier> {
    const response = await api.delete<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
};
