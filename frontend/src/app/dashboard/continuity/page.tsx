"use client";

import { useEffect, useState } from "react";
import { 
  Database, 
  Download, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Plus, 
  ShieldAlert,
  Loader2,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { continuityService } from "@/services/continuity.service";
import type { Backup, BackupConfig } from "@/types/continuity";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleAdminTable } from "@/components/admin/simple-admin-table";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";
import { ModuleNote } from "@/components/common/module-note";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContinuityPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<BackupConfig>({
    enabled: false,
    frequency: "DAILY",
    hour: 2,
    minute: 0,
    dayOfWeek: 1,
    maxBackups: 5,
  });

  async function loadBackups(showToast = false): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);
      const data = await continuityService.findAll();
      setBackups(data);
      if (showToast) {
        toast.success("Lista de copias de seguridad actualizada");
      }
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function loadConfig(): Promise<void> {
    try {
      const data = await continuityService.getConfig();
      setConfig(data);
    } catch (err: unknown) {
      console.error("Error al cargar la configuración de copias automáticas:", err);
    }
  }

  useEffect(() => {
    void loadBackups();
    void loadConfig();
  }, []);

  async function handleCreateBackup(): Promise<void> {
    try {
      setIsCreating(true);
      toast.loading("Generando copia de seguridad... Esto puede tomar unos segundos.", { id: "create-backup" });
      await continuityService.createBackup();
      toast.success("Copia de seguridad creada con éxito", { id: "create-backup" });
      void loadBackups();
    } catch (err: unknown) {
      toast.error("Error al crear copia de seguridad: " + getApiErrorMessage(err), { id: "create-backup" });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDownloadBackup(backup: Backup): Promise<void> {
    try {
      toast.loading(`Descargando copia de seguridad: ${backup.filename}...`, { id: "download-backup" });
      await continuityService.downloadBackup(backup.id, backup.filename);
      toast.success("Descarga iniciada con éxito", { id: "download-backup" });
    } catch (err: unknown) {
      toast.error("Error en la descarga: " + getApiErrorMessage(err), { id: "download-backup" });
    }
  }

  async function handleRestoreBackup(backup: Backup): Promise<void> {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que deseas restaurar la base de datos a la copia "${backup.filename}"?\n\n` +
      `⚠️ ¡ADVERTENCIA CRÍTICA!\n` +
      `Esta acción sobrescribirá completamente los datos actuales del sistema por los de este respaldo. ` +
      `Cualquier información creada después de la fecha de este backup se borrará definitivamente.`
    );

    if (!isConfirmed) return;

    const secondConfirm = window.confirm(
      `Confirma por segunda vez: ¿Estás completamente seguro?\n` +
      `Escribe "Aceptar" mentalmente y pulsa OK para proceder.`
    );

    if (!secondConfirm) return;

    try {
      toast.loading("Restaurando base de datos... Por favor, no cierres esta ventana.", { id: "restore-backup" });
      const result = await continuityService.restoreBackup(backup.id);
      
      if (result.status === "SUCCESS") {
        toast.success("Restauración completada con éxito. Recargando datos...", { id: "restore-backup" });
        void loadBackups();
      } else {
        toast.error(`Fallo en restauración: ${result.message}`, { id: "restore-backup" });
      }
    } catch (err: unknown) {
      toast.error("Error al restaurar copia de seguridad: " + getApiErrorMessage(err), { id: "restore-backup" });
    }
  }

  async function handleDeleteBackup(backup: Backup): Promise<void> {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el archivo "${backup.filename}"?\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!isConfirmed) return;

    try {
      toast.loading("Eliminando archivo de respaldo...", { id: "delete-backup" });
      await continuityService.deleteBackup(backup.id);
      toast.success("Copia de seguridad eliminada", { id: "delete-backup" });
      void loadBackups();
    } catch (err: unknown) {
      toast.error("Error al eliminar copia de seguridad: " + getApiErrorMessage(err), { id: "delete-backup" });
    }
  }

  async function handleSaveConfig(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      setIsSavingConfig(true);
      toast.loading("Guardando configuración programada...", { id: "save-config" });
      await continuityService.saveConfig(config);
      toast.success("Configuración programada guardada con éxito", { id: "save-config" });
      void loadConfig();
    } catch (err: unknown) {
      toast.error("Error al guardar configuración: " + getApiErrorMessage(err), { id: "save-config" });
    } finally {
      setIsSavingConfig(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Continuidad"
        description="Administración y restauración de copias de seguridad de la base de datos."
        badge="Copias de seguridad"
        icon={Database}
        actions={
          <div className="flex gap-2">
            <Button
              disabled={isLoading || isCreating}
              type="button"
              variant="outline"
              onClick={() => void loadBackups(true)}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button
              disabled={isCreating}
              type="button"
              onClick={() => void handleCreateBackup()}
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Generar Backup
            </Button>
          </div>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ModuleNote
            title="Política de Seguridad y Respaldo"
            description="Se recomienda generar una copia de seguridad antes de realizar cualquier actualización crítica en el sistema o al finalizar la jornada de trabajo. Mantén los respaldos limpios y elimina los que ya no sean necesarios."
            icon={ShieldAlert}
            variant="warning"
          />

          {isLoading && backups.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : (
            <SimpleAdminTable
              title="Historial de Copias de Seguridad"
              description="Lista de respaldos generados manual y automáticamente."
            >
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del Archivo</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado Por</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {backups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          No se han encontrado copias de seguridad. Haz clic en "Generar Backup" para crear la primera.
                        </TableCell>
                      </TableRow>
                    ) : (
                      backups.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell className="font-mono text-sm max-w-[180px] truncate" title={backup.filename}>
                            {backup.filename}
                          </TableCell>
                          <TableCell>{formatDateTime(backup.createdAt)}</TableCell>
                          <TableCell>{backup.size ?? "Sin registrar"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {backup.type === "MANUAL" ? "Manual" : "Automático"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge value={backup.status} />
                          </TableCell>
                          <TableCell>
                            {backup.createdBy
                              ? `${backup.createdBy.firstName} ${backup.createdBy.lastName}`
                              : "Sistema / Admin"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                title="Descargar copia de seguridad"
                                size="icon"
                                variant="ghost"
                                disabled={backup.status !== "SUCCESS" && backup.status !== "RESTORED"}
                                onClick={() => void handleDownloadBackup(backup)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                title="Restaurar base de datos a esta copia"
                                size="icon"
                                variant="ghost"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                disabled={backup.status !== "SUCCESS"}
                                onClick={() => void handleRestoreBackup(backup)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                title="Eliminar copia de seguridad"
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => void handleDeleteBackup(backup)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

        <div className="space-y-6">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Respaldo Automático
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Configura copias de seguridad automáticas en el servidor y define la política de retención.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium leading-none cursor-pointer" htmlFor="config-enabled">
                      Activar Programación
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Generar respaldos de forma automática.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="config-enabled"
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="config-frequency">
                    Frecuencia
                  </label>
                  <select
                    id="config-frequency"
                    value={config.frequency}
                    disabled={!config.enabled}
                    onChange={(e) => setConfig({ ...config, frequency: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="DAILY">Diario</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="MONTHLY">Mensual (1º de cada mes)</option>
                  </select>
                </div>

                {config.frequency === "WEEKLY" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="config-day-of-week">
                      Día de la semana
                    </label>
                    <select
                      id="config-day-of-week"
                      value={config.dayOfWeek ?? 1}
                      disabled={!config.enabled}
                      onChange={(e) => setConfig({ ...config, dayOfWeek: Number(e.target.value) })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={1}>Lunes</option>
                      <option value={2}>Martes</option>
                      <option value={3}>Miércoles</option>
                      <option value={4}>Jueves</option>
                      <option value={5}>Viernes</option>
                      <option value={6}>Sábado</option>
                      <option value={0}>Domingo</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="config-hour">
                      Hora
                    </label>
                    <select
                      id="config-hour"
                      value={config.hour}
                      disabled={!config.enabled}
                      onChange={(e) => setConfig({ ...config, hour: Number(e.target.value) })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="config-minute">
                      Minuto
                    </label>
                    <select
                      id="config-minute"
                      value={config.minute}
                      disabled={!config.enabled}
                      onChange={(e) => setConfig({ ...config, minute: Number(e.target.value) })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Array.from({ length: 60 }).map((_, m) => (
                        <option key={m} value={m}>
                          {String(m).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="config-max-backups">
                    Existencias Máximas (Retención)
                  </label>
                  <input
                    type="number"
                    id="config-max-backups"
                    min={1}
                    max={15}
                    value={config.maxBackups}
                    disabled={!config.enabled}
                    onChange={(e) => setConfig({ ...config, maxBackups: Math.max(1, Number(e.target.value)) })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Mantiene un máximo de {config.maxBackups} respaldos de tipo automático. Los respaldos antiguos se eliminarán automáticamente.
                  </p>
                </div>

                {config.lastExecuted && (
                  <div className="rounded-xl bg-muted/40 p-3 text-xs border border-dashed border-border/80">
                    <span className="font-semibold text-muted-foreground block mb-0.5">Última ejecución automática:</span>
                    <span className="font-mono text-muted-foreground">{config.lastExecuted}</span>
                  </div>
                )}

                <Button className="w-full" type="submit" disabled={isSavingConfig}>
                  {isSavingConfig && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Configuración
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
