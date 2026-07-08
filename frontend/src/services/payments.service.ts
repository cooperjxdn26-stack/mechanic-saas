import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreatePaymentPayload,
  Payment,
  PaymentQueryParams,
  PaymentSummary,
} from "@/types/payment";

function buildPaymentQuery(params?: PaymentQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.method) searchParams.set("method", params.method);
  if (params.status) searchParams.set("status", params.status);
  if (params.customerId) searchParams.set("customerId", params.customerId);
  if (params.invoiceId) searchParams.set("invoiceId", params.invoiceId);
  if (params.cashRegisterId) {
    searchParams.set("cashRegisterId", params.cashRegisterId);
  }
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const paymentsService = {
  async findAll(
    params?: PaymentQueryParams,
  ): Promise<PaginatedResponse<Payment>> {
    const query = buildPaymentQuery(params);

    const response = await api.get<PaginatedResponse<Payment>>(
      `/payments${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async create(payload: CreatePaymentPayload): Promise<Payment> {
    const response = await api.post<Payment>("/payments", payload);
    return response.data;
  },

  async summary(from?: string, to?: string): Promise<PaymentSummary> {
    const searchParams = new URLSearchParams();

    if (from) searchParams.set("from", from);
    if (to) searchParams.set("to", to);

    const query = searchParams.toString();

    const response = await api.get<PaymentSummary>(
      `/payments/summary${query ? `?${query}` : ""}`,
    );

    return response.data;
  },
};
