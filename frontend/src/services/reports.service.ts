import { api } from "@/lib/api";
import type {
  FinancialReport,
  InventoryReport,
  MechanicsReportResponse,
  SalesReport,
  WorkOrdersReport,
} from "@/types/report";

export const reportsService = {
  async sales(): Promise<SalesReport> {
    const response = await api.get<SalesReport>("/reports/sales");
    return response.data;
  },

  async inventory(): Promise<InventoryReport> {
    const response = await api.get<InventoryReport>("/reports/inventory");
    return response.data;
  },

  async workOrders(): Promise<WorkOrdersReport> {
    const response = await api.get<WorkOrdersReport>("/reports/work-orders");
    return response.data;
  },

  async financial(): Promise<FinancialReport> {
    const response = await api.get<FinancialReport>("/reports/financial");
    return response.data;
  },

  async mechanics(): Promise<MechanicsReportResponse> {
    const response =
      await api.get<MechanicsReportResponse>("/reports/mechanics");

    return response.data;
  },
};
