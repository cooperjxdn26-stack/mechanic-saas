"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { vehiclesService } from "@/services/vehicles.service";
import type { Vehicle } from "@/types/vehicle";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle(): Promise<void> {
      if (!id) {
        setError("ID de vehículo inválido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await vehiclesService.findOne(id);
        setVehicle(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadVehicle();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.vehicles}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar vehículo</h1>
          <p className="mt-1 text-muted-foreground">
            Actualiza datos técnicos y propietario del vehículo.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && vehicle ? (
        <VehicleForm vehicle={vehicle} mode="edit" />
      ) : null}
    </div>
  );
}
