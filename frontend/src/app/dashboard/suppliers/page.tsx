"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { suppliersService } from "@/services/suppliers.service";
import type { Supplier } from "@/types/supplier";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { SupplierTable } from "@/components/inventory/supplier-table";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSuppliers(searchValue = search): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await suppliersService.findAll({
        search: searchValue || undefined,
        page: 1,
        limit: 20,
      });

      setSuppliers(response.data);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadSuppliers(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  async function handleDeactivate(supplier: Supplier): Promise<void> {
    const shouldDeactivate = window.confirm(
      `¿Deseas desactivar el proveedor "${supplier.name}"?`,
    );

    if (!shouldDeactivate) {
      return;
    }

    try {
      await suppliersService.deactivate(supplier.id);
      toast.success("Proveedor desactivado");
      await loadSuppliers();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona proveedores de repuestos y compras.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <SupplierTable
        suppliers={suppliers}
        search={search}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}
