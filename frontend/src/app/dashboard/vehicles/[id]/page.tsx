"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { vehiclesService } from "@/services/vehicles.service";
import type {
  Vehicle,
  VehicleHistory as VehicleHistoryType,
} from "@/types/vehicle";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleProfile } from "@/components/vehicles/vehicle-profile";
import { VehicleHistory } from "@/components/vehicles/vehicle-history";

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [history, setHistory] = useState<VehicleHistoryType | null>(null);
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

        /*
         * Cargamos detalle e historial en paralelo.
         * Esto mejora el tiempo de carga de la pantalla.
         */
        const [vehicleResponse, historyResponse] = await Promise.all([
          vehiclesService.findOne(id),
          vehiclesService.history(id),
        ]);

        setVehicle(vehicleResponse);
        setHistory(historyResponse);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadVehicle();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.vehicles}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Perfil del vehículo
          </h1>
          <p className="mt-1 text-muted-foreground">
            Información técnica e historial del vehículo.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : null}

      {!isLoading && vehicle ? <VehicleProfile vehicle={vehicle} /> : null}

      {!isLoading && history ? <VehicleHistory history={history} /> : null}
    </div>
  );
}
