"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { notificationsService } from "@/services/notifications.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./user-menu";

export function DashboardHeader() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  /*
   * Consulta cuántas notificaciones no leídas existen.
   * No mostramos toast aquí para no molestar al usuario
   * porque esta consulta se ejecutará automáticamente.
   */
  const loadUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const response = await notificationsService.unreadCount();

      setUnreadCount(response.unread ?? 0);
    } catch (error: unknown) {
      console.error(getApiErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    /*
     * Carga inicial del contador.
     */
    void loadUnreadCount();

    /*
     * Refresca cada 30 segundos.
     * Así la campanita se actualiza cuando se genera una nueva notificación.
     */
    const intervalId = window.setInterval(() => {
      void loadUnreadCount();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadUnreadCount]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="relative hidden flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          className="max-w-xl rounded-xl pl-9"
          placeholder="Buscar clientes, placas, órdenes, repuestos..."
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/*
         * Campanita con contador de notificaciones no leídas.
         * Al hacer clic lleva al módulo de notificaciones.
         */}
        <Button asChild size="icon" variant="ghost" className="relative">
          <Link href="/dashboard/notifications" aria-label="Ver notificaciones">
            <Bell className="h-5 w-5" />

            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}
