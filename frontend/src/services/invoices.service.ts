import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceQueryParams,
} from "@/types/invoice";

function buildInvoiceQuery(params?: InvoiceQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.customerId) searchParams.set("customerId", params.customerId);
  if (params.quoteId) searchParams.set("quoteId", params.quoteId);
  if (params.workOrderId) searchParams.set("workOrderId", params.workOrderId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const invoicesService = {
  async findAll(
    params?: InvoiceQueryParams,
  ): Promise<PaginatedResponse<Invoice>> {
    const query = buildInvoiceQuery(params);

    const response = await api.get<PaginatedResponse<Invoice>>(
      `/invoices${query}`,
    );

    return response.data;
  },

  async findOne(id: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  async create(payload: CreateInvoicePayload): Promise<Invoice> {
    const response = await api.post<Invoice>("/invoices", payload);
    return response.data;
  },

  async createFromQuote(quoteId: string): Promise<Invoice> {
    /*
     * Crea factura desde una cotización aprobada.
     * El backend valida que la cotización esté aprobada.
     */
    const response = await api.post<Invoice>(`/invoices/from-quote/${quoteId}`);
    return response.data;
  },

  async cancel(id: string): Promise<Invoice> {
    const response = await api.patch<Invoice>(`/invoices/${id}/cancel`);
    return response.data;
  },
};
