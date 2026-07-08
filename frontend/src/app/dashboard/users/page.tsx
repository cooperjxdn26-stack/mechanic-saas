"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/user";

import { RoleGuard } from "@/components/auth/role-guard";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await usersService.findAll();
        setUsers(response.data);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  return (
    <RoleGuard permissions={["users.view"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="mt-1 text-muted-foreground">
              Gestión de usuarios del taller.
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/users/new">Nuevo usuario</Link>
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
            title="Usuarios registrados"
            description="Listado de usuarios con rol y estado."
          >
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No hay usuarios.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role?.name ?? "Sin rol"}</TableCell>
                        <TableCell>
                          <Badge>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/dashboard/users/${user.id}/edit`}>
                              Editar
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </SimpleAdminTable>
        )}
      </div>
    </RoleGuard>
  );
}
