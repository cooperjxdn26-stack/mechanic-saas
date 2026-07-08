"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { rolesService } from "@/services/roles.service";
import type { AdminRole } from "@/types/admin";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleAdminTable } from "@/components/admin/simple-admin-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoles(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await rolesService.findAll();
        setRoles(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <p className="mt-1 text-muted-foreground">
          Roles y permisos base del sistema.
        </p>
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
          title="Roles registrados"
          description="Roles usados para controlar accesos."
        >
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Creado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No hay roles registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        {role.description ?? "Sin descripción"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={role.isSystem ? "default" : "secondary"}
                        >
                          {role.isSystem ? "Sistema" : "Personalizado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(role.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </SimpleAdminTable>
      )}
    </div>
  );
}
