"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { servicesService } from "@/services/services.service";
import type { WorkshopService } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ServiceTable } from "@/components/inventory/service-table";

export default function ServicesPage() {
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadServices(searchValue = search): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await servicesService.findAll({
        search: searchValue || undefined,
        page: 1,
        limit: 20,
      });

      setServices(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadServices(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  async function handleDeactivate(service: WorkshopService): Promise<void> {
    const shouldDeactivate = window.confirm(
      `¿Deseas desactivar el servicio "${service.name}"?`,
    );

    if (!shouldDeactivate) {
      return;
    }

    try {
      await servicesService.deactivate(service.id);
      toast.success("Servicio desactivado");
      await loadServices();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
        <p className="mt-1 text-muted-foreground">
          Catálogo de servicios del taller.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ServiceTable
        services={services}
        search={search}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}
