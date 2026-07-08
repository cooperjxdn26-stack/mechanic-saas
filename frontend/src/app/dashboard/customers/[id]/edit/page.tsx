"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { routes } from "@/config/routes";
import { getApiErrorMessage } from "@/lib/api";
import { customersService } from "@/services/customers.service";
import type { Customer } from "@/types/customer";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerForm } from "@/components/customers/customer-form";

interface CustomerEditRouteParams {
  id: string;
}

function getCustomerEditRouteParams(
  params: ReturnType<typeof useParams>,
): CustomerEditRouteParams | null {
  const id = params.id;

  if (typeof id !== "string") {
    return null;
  }

  return { id };
}

export default function EditCustomerPage() {
  const params = useParams();
  const routeParams = getCustomerEditRouteParams(params);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomer(): Promise<void> {
      if (!routeParams) {
        setError("ID de cliente inválido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await customersService.findOne(routeParams.id);
        setCustomer(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadCustomer();
  }, [routeParams?.id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href={routes.customers}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar cliente</h1>
          <p className="mt-1 text-muted-foreground">
            Actualiza los datos del cliente seleccionado.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && customer ? (
        <CustomerForm customer={customer} mode="edit" />
      ) : null}
    </div>
  );
}
