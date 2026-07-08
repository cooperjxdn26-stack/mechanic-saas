import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SupplierForm } from "@/components/inventory/supplier-form";

export default function NewSupplierPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/suppliers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo proveedor</h1>
          <p className="mt-1 text-muted-foreground">
            Registra información de contacto y datos comerciales.
          </p>
        </div>
      </div>

      <SupplierForm />
    </div>
  );
}
