export type NotificationType =
  | "INTERNAL"
  | "EMAIL"
  | "WHATSAPP"
  | "SYSTEM"
  | "STOCK"
  | "PAYMENT"
  | "WORK_ORDER";

export type NotificationStatus = "PENDING" | "SENT" | "READ" | "FAILED";

export interface AppNotificationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType | string;
  status: NotificationStatus | string;
  actionUrl?: string | null;
  userId?: string | null;
  user?: AppNotificationUser | null;
  sentAt?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/*
 * Respuesta del contador de no leídas.
 * Backend:
 * { unread: 3 }
 */
export interface UnreadCountResponse {
  unread: number;
}

/*
 * Respuesta al marcar todas como leídas.
 * Backend:
 * { message: "Notificaciones marcadas como leídas" }
 */
export interface MarkAllNotificationsReadResponse {
  message: string;
}
