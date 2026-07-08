import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateQuotePayload,
  Quote,
  QuoteQueryParams,
  UpdateQuotePayload,
} from "@/types/quote";

function buildQuoteQuery(params?: QuoteQueryParams): string {
  const searchParams = new URLSearchParams();

  if (!params) {
    return "";
  }

  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.customerId) searchParams.set("customerId", params.customerId);
  if (params.vehicleId) searchParams.set("vehicleId", params.vehicleId);
  if (params.workOrderId) searchParams.set("workOrderId", params.workOrderId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const quotesService = {
  async findAll(params?: QuoteQueryParams): Promise<PaginatedResponse<Quote>> {
    const query = buildQuoteQuery(params);

    const response = await api.get<PaginatedResponse<Quote>>(`/quotes${query}`);

    return response.data;
  },

  async findOne(id: string): Promise<Quote> {
    const response = await api.get<Quote>(`/quotes/${id}`);
    return response.data;
  },

  async findPublic(token: string): Promise<Quote> {
    const response = await api.get<Quote>(`/quotes/public/${token}`);
    return response.data;
  },

  async create(payload: CreateQuotePayload): Promise<Quote> {
    const response = await api.post<Quote>("/quotes", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateQuotePayload): Promise<Quote> {
    const response = await api.patch<Quote>(`/quotes/${id}`, payload);
    return response.data;
  },

  async approve(id: string): Promise<Quote> {
    const response = await api.patch<Quote>(`/quotes/${id}/approve`);
    return response.data;
  },

  async reject(id: string): Promise<Quote> {
    const response = await api.patch<Quote>(`/quotes/${id}/reject`);
    return response.data;
  },

  async approvePublic(token: string): Promise<Quote> {
    const response = await api.patch<Quote>(`/quotes/public/${token}/approve`);
    return response.data;
  },

  async rejectPublic(token: string): Promise<Quote> {
    const response = await api.patch<Quote>(`/quotes/public/${token}/reject`);
    return response.data;
  },
};
