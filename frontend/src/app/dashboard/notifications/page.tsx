"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { notificationsService } from "@/services/notifications.service";
import type { AppNotification } from "@/types/admin";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleAdminTable } from "@/components/admin/simple-admin-table";

/*
 * Respuesta paginada que normalmente devuelve el backend.
 * Ejemplo:
 * {
 *   data: [...],
 *   meta: { total, page, limit, lastPage }
 * }
 */
interface NotificationsResponse {
  data?: AppNotification[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

/*
 * Verifica si la respuesta tiene forma paginada.
 * Evitamos any y protegemos el .map().
 */
function isNotificationsResponse(
  response: unknown,
): response is NotificationsResponse {
  return (
    typeof response === "object" && response !== null && "data" in response
  );
}

/*
 * Normaliza la respuesta del backend.
 * Soporta:
 * 1. Array directo.
 * 2. Objeto paginado con data.
 */
function normalizeNotificationsResponse(response: unknown): AppNotification[] {
  if (Array.isArray(response)) {
    return response as AppNotification[];
  }

  if (isNotificationsResponse(response)) {
    return response.data ?? [];
  }

  return [];
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Carga notificaciones.
   * showLoading permite reutilizar la función sin forzar loading
   * cuando solo queremos refrescar luego de una acción.
   */
  const loadNotifications = useCallback(
    async (showLoading = true): Promise<void> => {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        setError(null);

        const response: unknown = await notificationsService.findAll();
        const normalizedNotifications =
          normalizeNotificationsResponse(response);

        setNotifications(normalizedNotifications);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    /*
     * Evita el warning:
     * "Calling setState synchronously within an effect..."
     *
     * El estado inicial ya tiene isLoading = true,
     * así que no necesitamos activar loading otra vez al montar.
     */
    queueMicrotask(() => {
      void loadNotifications(false);
    });
  }, [loadNotifications]);

  async function markAllAsRead(): Promise<void> {
    try {
      await notificationsService.markAllAsRead();
      toast.success("Notificaciones marcadas como leídas");

      /*
       * Refrescamos la lista después de marcar como leídas.
       */
      await loadNotifications();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="mt-1 text-muted-foreground">
            Alertas del sistema, stock, órdenes y pagos.
          </p>
        </div>

        <Button onClick={markAllAsRead}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Marcar todo como leído
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : (
        <SimpleAdminTable
          title="Centro de notificaciones"
          description="Eventos importantes generados por el sistema."
        >
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay notificaciones.
              </div>
            ) : (
              notifications.map((notification) => {
                const isRead = notification.status === "READ";

                return (
                  <div
                    key={notification.id}
                    className="flex gap-3 rounded-xl border p-4"
                  >
                    <div className="h-fit rounded-xl bg-primary/10 p-2 text-primary">
                      <Bell className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{notification.title}</p>

                        <Badge variant={isRead ? "secondary" : "default"}>
                          {isRead ? "Leída" : "Nueva"}
                        </Badge>

                        <Badge variant="outline">{notification.type}</Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SimpleAdminTable>
      )}
    </div>
  );
}
