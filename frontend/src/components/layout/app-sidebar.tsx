"use client";

import { Wrench } from "lucide-react";

import { appConfig } from "@/config/app";
import { navigationGroups } from "@/config/navigation";
import { hasPermission } from "@/config/permissions";
import { useAuth } from "@/hooks/use-auth";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "./nav-item";

function getUserRole(user: unknown): string | null {
  if (!user || typeof user !== "object") {
    return null;
  }

  const userRecord = user as Record<string, unknown>;
  const roleValue = userRecord.role;

  /*
   * Caso actual recomendado:
   * role: "SUPER_ADMIN"
   */
  if (typeof roleValue === "string") {
    return roleValue.trim().toUpperCase().replace(/\s+/g, "_");
  }

  /*
   * Caso anterior o respuesta de algunos endpoints:
   * role: { name: "SUPER_ADMIN" }
   */
  if (
    typeof roleValue === "object" &&
    roleValue !== null &&
    "name" in roleValue
  ) {
    const roleObject = roleValue as { name?: unknown };

    if (typeof roleObject.name === "string") {
      return roleObject.name.trim().toUpperCase().replace(/\s+/g, "_");
    }
  }

  return null;
}

export function AppSidebar() {
  const { user } = useAuth();

  /*
   * El rol puede venir como:
   * - "SUPER_ADMIN"
   * - { name: "SUPER_ADMIN" }
   *
   * Lo normalizamos para que hasPermission reciba siempre string.
   */
  const userRole = getUserRole(user);

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Wrench className="h-5 w-5" />
        </div>

        <div>
          <p className="font-bold leading-none">{appConfig.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gestión de taller
          </p>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navigationGroups.map((group) => {
            /*
             * SUPER_ADMIN ve todos los módulos.
             * Para los demás roles se valida el permiso normal.
             */
            const visibleItems = group.items.filter((item) => {
              if (userRole === "SUPER_ADMIN") {
                return true;
              }

              return hasPermission(userRole, item.permission);
            });

            if (visibleItems.length === 0) {
              return null;
            }

            return (
              <div key={group.title} className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
