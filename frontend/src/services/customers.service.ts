import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateCustomerPayload,
  Customer,
  CustomerQueryParams,
  CustomerStats,
  UpdateCustomerPayload,
} from "@/types/customer";

function buildCustomerQuery(params?: CustomerQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.type) searchParams.set("type", params.type);
  if (params.status) searchParams.set("status", params.status);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (params.branchId) searchParams.set("branchId", params.branchId);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const customersService = {
  async findAll(
    params?: CustomerQueryParams,
  ): Promise<PaginatedResponse<Customer>> {
    const query = buildCustomerQuery(params);
    const response = await api.get<PaginatedResponse<Customer>>(
      `/customers${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Customer> {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    const response = await api.post<Customer>("/customers", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const response = await api.patch<Customer>(`/customers/${id}`, payload);
    return response.data;
  },

  async deactivate(id: string): Promise<Customer> {
    const response = await api.delete<Customer>(`/customers/${id}`);
    return response.data;
  },

  async stats(): Promise<CustomerStats> {
    const response = await api.get<CustomerStats>("/customers/stats");
    return response.data;
  },
};
