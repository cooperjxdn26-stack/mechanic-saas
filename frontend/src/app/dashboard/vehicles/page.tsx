"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Car,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { hasPermission } from "@/config/permissions";
import { vehiclesService } from "@/services/vehicles.service";
import { useAuth } from "@/hooks/use-auth";
import type { Vehicle } from "@/types/vehicle";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/common/page-header";
import { MetricCard } from "@/components/common/metric-card";
import { ModuleNote } from "@/components/common/module-note";

export default function VehiclesPage() {
  const { user } = useAuth();

  const userRole = user?.role?.name ?? null;

  const canCreateVehicle = hasPermission(userRole, "vehicles.create");
  const canDeleteVehicle = hasPermission(userRole, "vehicles.delete");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Métricas rápidas del módulo.
   * Se calculan desde los vehículos cargados en la vista actual.
   */
  const stats = useMemo(() => {
    const total = vehicles.length;

    const withOwner = vehicles.filter((vehicle) => {
      return Boolean(vehicle.customerId || vehicle.customer);
    }).length;

    const withPlate = vehicles.filter((vehicle) => {
      return Boolean(vehicle.plate);
    }).length;

    return {
      total,
      withOwner,
      withPlate,
    };
  }, [vehicles]);

  async function loadVehicles(searchValue = search): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await vehiclesService.findAll({
        search: searchValue || undefined,
        page: 1,
        limit: 20,
      });

      /*
       * Protección para evitar errores si el backend devuelve
       * una estructura inesperada.
       */
      setVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (requestError: unknown) {
      setVehicles([]);
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  /*
   * Búsqueda con pequeño delay para evitar llamar al backend en cada tecla.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadVehicles(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  async function handleRefresh(): Promise<void> {
    try {
      setIsRefreshing(true);
      await loadVehicles(search);
      toast.success("Vehículos actualizados");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleRemove(vehicle: Vehicle): Promise<void> {
    /*
     * Aunque el botón se debe ocultar desde la tabla después,
     * dejamos esta validación para evitar acciones no permitidas.
     */
    if (!canDeleteVehicle) {
      toast.error("No tienes permiso para eliminar vehículos");
      return;
    }

    const shouldRemove = window.confirm(
      `¿Deseas eliminar el vehículo ${vehicle.plate}? Si tiene historial, el backend puede bloquear la eliminación.`,
    );

    if (!shouldRemove) {
      return;
    }

    try {
      await vehiclesService.remove(vehicle.id);
      toast.success("Vehículo eliminado correctamente");
      await loadVehicles();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <RoleGuard permissions={["vehicles.view"]}>
      <div className="space-y-5">
        <PageHeader
          title="Vehículos"
          description="Administra placas, propietarios, datos técnicos e historial operativo de cada vehículo."
          badge="CRM"
          icon={Car}
          actions={
            <>
              <Button
                disabled={isRefreshing}
                type="button"
                variant="outline"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Actualizar
              </Button>

              {canCreateVehicle ? (
                <Button asChild>
                  <Link href="/dashboard/vehicles/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo vehículo
                  </Link>
                </Button>
              ) : null}
            </>
          }
        />

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            title="Vehículos"
            value={stats.total}
            description="Vista actual"
            icon={Car}
          />

          <MetricCard
            title="Con propietario"
            value={stats.withOwner}
            description="Asociados a cliente"
            icon={UserRound}
          />

          <MetricCard
            title="Con placa"
            value={stats.withPlate}
            description="Identificación registrada"
            icon={ClipboardList}
          />
        </div>

        <ModuleNote
          title="Historial técnico protegido"
          description="Si un vehículo tiene órdenes, diagnósticos o cotizaciones, el backend puede impedir su eliminación para conservar trazabilidad."
          icon={ShieldCheck}
          variant="info"
        />

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <VehicleTable
          vehicles={vehicles}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          onRemove={handleRemove}
        />
      </div>
    </RoleGuard>
  );
}
