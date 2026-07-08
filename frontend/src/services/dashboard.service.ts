import { api } from "@/lib/api";
import type {
  DashboardAlerts,
  DashboardOverview,
  OrdersByStatusItem,
  RevenueByDayItem,
} from "@/types/dashboard";

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get<DashboardOverview>("/dashboard/overview");
    return response.data;
  },

  async getOrdersByStatus(): Promise<OrdersByStatusItem[]> {
    const response = await api.get<OrdersByStatusItem[]>(
      "/dashboard/orders-by-status",
    );

    return response.data;
  },

  async getRevenueByDay(): Promise<RevenueByDayItem[]> {
    const response = await api.get<RevenueByDayItem[]>(
      "/dashboard/revenue-by-day",
    );

    return response.data;
  },

  async getAlerts(): Promise<DashboardAlerts> {
    const response = await api.get<DashboardAlerts>("/dashboard/alerts");
    return response.data;
  },
};
