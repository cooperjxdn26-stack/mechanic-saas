"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { hasPermission } from "@/config/permissions";
import { customersService } from "@/services/customers.service";
import { useAuth } from "@/hooks/use-auth";
import type { Customer } from "@/types/customer";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomerTable } from "@/components/customers/customer-table";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/common/page-header";
import { MetricCard } from "@/components/common/metric-card";

/*
 * El usuario puede venir como:
 * role: "SUPER_ADMIN"
 * o como:
 * role: { name: "SUPER_ADMIN" }
 *
 * Normalizamos para que los permisos no fallen.
 */
function getUserRole(user: unknown): string | null {
  if (!user || typeof user !== "object") {
    return null;
  }

  const userRecord = user as Record<string, unknown>;
  const roleValue = userRecord.role;

  if (typeof roleValue === "string") {
    return roleValue.trim().toUpperCase().replace(/\s+/g, "_");
  }

  if (
    typeof roleValue === "object" &&
    roleValue !== null &&
    "name" in roleValue
  ) {
    const roleObject = roleValue as { name?: unknown };

    if (typeof roleObject.name === "string") {
      return roleObject.name.trim().toUpperCase().replace(/\s+/g, "_");
    }
  }

  return null;
}

export default function CustomersPage() {
  const { user } = useAuth();

  const userRole = getUserRole(user);

  /*
   * SUPER_ADMIN puede crear siempre.
   * Los demás roles dependen del permiso configurado.
   */
  const canCreateCustomer =
    userRole === "SUPER_ADMIN" || hasPermission(userRole, "customers.create");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Métricas rápidas del módulo.
   *
   * Backend maneja estados:
   * ACTIVE, INACTIVE, VIP, DEBTOR.
   *
   * Activos:
   * - ACTIVE
   * - VIP
   * - DEBTOR
   *
   * Inactivos:
   * - solo INACTIVE
   */
  const stats = useMemo(() => {
    const total = customers.length;

    const active = customers.filter((customer) =>
      ["ACTIVE", "VIP", "DEBTOR"].includes(customer.status),
    ).length;

    const inactive = customers.filter(
      (customer) => customer.status === "INACTIVE",
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [customers]);

  const loadCustomers = useCallback(
    async (searchValue = search): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await customersService.findAll({
          search: searchValue || undefined,
          page: 1,
          limit: 20,
        });

        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (requestError: unknown) {
        setCustomers([]);
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    },
    [search],
  );

  /*
   * Búsqueda con retardo para evitar muchas peticiones al backend.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadCustomers(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, loadCustomers]);

  async function handleRefresh(): Promise<void> {
    try {
      setIsRefreshing(true);
      await loadCustomers(search);
      toast.success("Clientes actualizados");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleDeactivate(customer: Customer): Promise<void> {
    const shouldDeactivate = window.confirm(
      `¿Deseas desactivar al cliente ${customer.name}?`,
    );

    if (!shouldDeactivate) {
      return;
    }

    try {
      await customersService.deactivate(customer.id);
      toast.success("Cliente desactivado correctamente");
      await loadCustomers();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <RoleGuard permissions={["customers.view"]}>
      <div className="space-y-5">
        <PageHeader
          title="Clientes"
          description="Gestiona clientes naturales, empresas y sus datos de contacto."
          badge="CRM"
          icon={Users}
          actions={
            <>
              <Button
                disabled={isRefreshing}
                type="button"
                variant="outline"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Actualizar
              </Button>

              {canCreateCustomer ? (
                <Button asChild>
                  <Link href="/dashboard/customers/new">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo cliente
                  </Link>
                </Button>
              ) : null}
            </>
          }
        />

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            title="Clientes"
            value={stats.total}
            description="Vista actual"
            icon={Users}
          />

          <MetricCard
            title="Activos"
            value={stats.active}
            description="Clientes disponibles"
            icon={UserCheck}
          />

          <MetricCard
            title="Inactivos"
            value={stats.inactive}
            description="Clientes desactivados"
            icon={UserX}
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <CustomerTable
          customers={customers}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          onDeactivate={handleDeactivate}
        />
      </div>
    </RoleGuard>
  );
}
