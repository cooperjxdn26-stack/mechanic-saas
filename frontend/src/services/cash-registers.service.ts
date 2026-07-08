import { api } from "@/lib/api";
import type {
  CashRegister,
  CashRegisterSummary,
  CloseCashRegisterPayload,
  OpenCashRegisterPayload,
} from "@/types/cash-register";

export const cashRegistersService = {
  async findAll(status?: string, branchId?: string): Promise<CashRegister[]> {
    const searchParams = new URLSearchParams();

    if (status) searchParams.set("status", status);
    if (branchId) searchParams.set("branchId", branchId);

    const query = searchParams.toString();

    const response = await api.get<CashRegister[]>(
      `/cash-registers${query ? `?${query}` : ""}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<CashRegister> {
    const response = await api.get<CashRegister>(`/cash-registers/${id}`);
    return response.data;
  },

  async getOpen(branchId?: string): Promise<CashRegister> {
    const searchParams = new URLSearchParams();

    if (branchId) {
      searchParams.set("branchId", branchId);
    }

    const query = searchParams.toString();

    /*
     * Debe coincidir exactamente con el backend:
     * GET /cash-registers/open/current
     */
    const response = await api.get<CashRegister>(
      `/cash-registers/open/current${query ? `?${query}` : ""}`,
    );

    return response.data;
  },

  async open(payload: OpenCashRegisterPayload): Promise<CashRegister> {
    const response = await api.post<CashRegister>(
      "/cash-registers/open",
      payload,
    );

    return response.data;
  },

  async close(
    id: string,
    payload: CloseCashRegisterPayload,
  ): Promise<CashRegister> {
    const response = await api.patch<CashRegister>(
      `/cash-registers/${id}/close`,
      payload,
    );

    return response.data;
  },

  async summary(id: string): Promise<CashRegisterSummary> {
    const response = await api.get<CashRegisterSummary>(
      `/cash-registers/${id}/summary`,
    );

    return response.data;
  },
};
