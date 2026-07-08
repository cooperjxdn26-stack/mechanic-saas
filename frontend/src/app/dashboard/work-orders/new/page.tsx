import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/config/routes";

import { Button } from "@/components/ui/button";
import { WorkOrderForm } from "@/components/work-orders/work-order-form";

export default function NewWorkOrderPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.workOrders}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nueva orden de trabajo
          </h1>
          <p className="mt-1 text-muted-foreground">
            Registra el ingreso de un vehículo al taller.
          </p>
        </div>
      </div>

      <WorkOrderForm mode="create" />
    </div>
  );
}
