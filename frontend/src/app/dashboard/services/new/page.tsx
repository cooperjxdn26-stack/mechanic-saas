import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/inventory/service-form";

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo servicio</h1>
          <p className="mt-1 text-muted-foreground">
            Crea un servicio para usarlo en cotizaciones.
          </p>
        </div>
      </div>

      <ServiceForm />
    </div>
  );
}
