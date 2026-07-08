import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleHistory,
  VehicleQueryParams,
  VehicleStats,
} from "@/types/vehicle";

function buildVehicleQuery(params?: VehicleQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.customerId) searchParams.set("customerId", params.customerId);
  if (params.branchId) searchParams.set("branchId", params.branchId);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const vehiclesService = {
  async findAll(
    params?: VehicleQueryParams,
  ): Promise<PaginatedResponse<Vehicle>> {
    const query = buildVehicleQuery(params);

    const response = await api.get<PaginatedResponse<Vehicle>>(
      `/vehicles${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Vehicle> {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  async create(payload: CreateVehiclePayload): Promise<Vehicle> {
    const response = await api.post<Vehicle>("/vehicles", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const response = await api.patch<Vehicle>(`/vehicles/${id}`, payload);
    return response.data;
  },

  async remove(id: string): Promise<Vehicle> {
    const response = await api.delete<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  async stats(): Promise<VehicleStats> {
    const response = await api.get<VehicleStats>("/vehicles/stats");
    return response.data;
  },

  async history(id: string): Promise<VehicleHistory> {
    const response = await api.get<VehicleHistory>(`/vehicles/${id}/history`);
    return response.data;
  },
};
