"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { auditLogsService } from "@/services/audit-logs.service";
import type { AuditLog } from "@/types/admin";

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

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * Auditoría es solo lectura.
         * Nunca editamos estos registros desde frontend.
         */
        const response = await auditLogsService.findAll();
        setLogs(response.data);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoría</h1>
          <p className="mt-1 text-muted-foreground">
            Historial de acciones críticas del sistema.
          </p>
        </div>
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
          title="Registros de auditoría"
          description="Acciones de usuarios sobre entidades importantes."
        >
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay registros.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell>
                        {log.user
                          ? `${log.user.firstName} ${log.user.lastName}`
                          : "Sistema"}
                      </TableCell>
                      <TableCell>
                        {log.description ?? "Sin descripción"}
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
  );
}
