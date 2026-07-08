import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PartForm } from "@/components/inventory/part-form";

export default function NewPartPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/parts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo repuesto</h1>
          <p className="mt-1 text-muted-foreground">
            Registra un repuesto y su stock inicial.
          </p>
        </div>
      </div>

      <PartForm mode="create" />
    </div>
  );
}
