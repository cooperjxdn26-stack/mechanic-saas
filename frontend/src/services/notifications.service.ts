import { api } from "@/lib/api";
import type {
  AppNotification,
  MarkAllNotificationsReadResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const notificationsService = {
  /*
   * Lista todas las notificaciones.
   *
   * Mantengo tu lógica original usando /notifications.
   * Esta ruta normalmente es para SUPER_ADMIN o ADMIN.
   */
  async findAll(): Promise<AppNotification[]> {
    const response = await api.get<AppNotification[]>("/notifications");
    return response.data;
  },

  /*
   * Lista solo las notificaciones del usuario autenticado.
   *
   * Esta es la ruta ideal para la campanita y alertas personales.
   */
  async findMine(): Promise<AppNotification[]> {
    const response = await api.get<AppNotification[]>("/notifications/me");
    return response.data;
  },

  /*
   * Marca una notificación específica como leída.
   */
  async markAsRead(id: string): Promise<AppNotification> {
    const response = await api.patch<AppNotification>(
      `/notifications/${id}/read`,
    );

    return response.data;
  },

  /*
   * Marca todas las notificaciones del usuario autenticado como leídas.
   *
   * Ruta correcta:
   * PATCH /notifications/me/read-all
   */
  async markAllAsRead(): Promise<MarkAllNotificationsReadResponse> {
    const response = await api.patch<MarkAllNotificationsReadResponse>(
      "/notifications/me/read-all",
    );

    return response.data;
  },

  /*
   * Obtiene la cantidad de notificaciones no leídas
   * para mostrar el contador rojo en la campanita.
   */
  async unreadCount(): Promise<UnreadCountResponse> {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/me/unread-count",
    );

    return response.data;
  },
};
