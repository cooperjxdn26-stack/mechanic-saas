import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/config/routes";

import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.vehicles}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo vehículo</h1>
          <p className="mt-1 text-muted-foreground">
            Registra un vehículo y asígnalo a un cliente.
          </p>
        </div>
      </div>

      <VehicleForm mode="create" />
    </div>
  );
}
