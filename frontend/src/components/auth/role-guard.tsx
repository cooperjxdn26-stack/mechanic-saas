"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import type { AppPermission } from "@/config/permissions";
import { hasAnyPermission } from "@/config/permissions";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleGuardProps {
  permissions: AppPermission[];
  children: React.ReactNode;
}

/*
 * Obtiene el rol del usuario de forma segura.
 *
 * Soporta ambos formatos:
 * 1. role: "SUPER_ADMIN"
 * 2. role: { name: "SUPER_ADMIN" }
 */
function getUserRole(user: unknown): string | null {
  if (!user || typeof user !== "object") {
    return null;
  }

  const userRecord = user as Record<string, unknown>;
  const roleValue = userRecord.role;

  /*
   * Formato actual recomendado:
   * role: "SUPER_ADMIN"
   */
  if (typeof roleValue === "string") {
    return roleValue.trim().toUpperCase().replace(/\s+/g, "_");
  }

  /*
   * Formato anterior:
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

/*
 * Este componente protege páginas o secciones.
 * Si el usuario no tiene permiso, no renderiza el contenido.
 */
export function RoleGuard({ permissions, children }: RoleGuardProps) {
  const { user } = useAuth();

  /*
   * Antes estaba:
   * const userRole = user?.role?.name ?? null;
   *
   * Eso fallaba porque ahora role puede venir como string:
   * "SUPER_ADMIN"
   */
  const userRole = getUserRole(user);

  /*
   * SUPER_ADMIN tiene acceso total.
   * Para los demás roles se valida con hasAnyPermission.
   */
  const canAccess =
    userRole === "SUPER_ADMIN" || hasAnyPermission(userRole, permissions);

  if (!canAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md rounded-2xl text-center">
          <CardHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <CardTitle>Acceso denegado</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tu rol no tiene permisos para acceder a este módulo.
            </p>

            <Button asChild>
              <Link href="/dashboard">Volver al dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
