import {
  ComplaintBookEntry,
  ComplaintBookListResponse,
  ComplaintBookStatus,
  CreateComplaintBookEntryPayload,
} from "@/types/complaint-book";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface GetComplaintBookParams {
  search?: string;
  status?: ComplaintBookStatus | "";
  page?: number;
  limit?: number;
}

function getAuthHeaders() {
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
    };
  }

  const token =
    localStorage.getItem("mechanic_saas_token") ||
    localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(
  response: Response,
  defaultMessage: string,
): Promise<T> {
  if (!response.ok) {
    let message = defaultMessage;

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || defaultMessage;
    } catch {
      message = `${defaultMessage}. Estado: ${response.status}`;
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getComplaintBookEntries(
  params?: GetComplaintBookParams,
): Promise<ComplaintBookListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  const response = await fetch(
    `${API_URL}/complaint-book${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    },
  );

  return handleResponse<ComplaintBookListResponse>(
    response,
    "No se pudieron obtener las reclamaciones",
  );
}

export async function createComplaintBookEntry(
  payload: CreateComplaintBookEntryPayload,
): Promise<ComplaintBookEntry> {
  const response = await fetch(`${API_URL}/complaint-book`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<ComplaintBookEntry>(
    response,
    "No se pudo registrar la reclamación",
  );
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintBookStatus,
): Promise<ComplaintBookEntry> {
  const response = await fetch(`${API_URL}/complaint-book/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  return handleResponse<ComplaintBookEntry>(
    response,
    "No se pudo actualizar el estado",
  );
}
