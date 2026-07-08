import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/config/routes";

import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.customers}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo cliente</h1>
          <p className="mt-1 text-muted-foreground">
            Registra un cliente natural o empresa.
          </p>
        </div>
      </div>

      <CustomerForm mode="create" />
    </div>
  );
}
