import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateServicePayload,
  ServiceQueryParams,
  UpdateServicePayload,
  WorkshopService,
} from "@/types/inventory";

function buildServiceQuery(params?: ServiceQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const servicesService = {
  async findAll(
    params?: ServiceQueryParams,
  ): Promise<PaginatedResponse<WorkshopService>> {
    const query = buildServiceQuery(params);

    const response = await api.get<PaginatedResponse<WorkshopService>>(
      `/services${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<WorkshopService> {
    const response = await api.get<WorkshopService>(`/services/${id}`);
    return response.data;
  },

  async create(payload: CreateServicePayload): Promise<WorkshopService> {
    const response = await api.post<WorkshopService>("/services", payload);
    return response.data;
  },

  async update(
    id: string,
    payload: UpdateServicePayload,
  ): Promise<WorkshopService> {
    const response = await api.patch<WorkshopService>(
      `/services/${id}`,
      payload,
    );

    return response.data;
  },

  async deactivate(id: string): Promise<WorkshopService> {
    const response = await api.delete<WorkshopService>(`/services/${id}`);
    return response.data;
  },
};
