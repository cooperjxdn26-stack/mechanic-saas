"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Car,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Package,
  RefreshCw,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { hasPermission } from "@/config/permissions";
import { dashboardService } from "@/services/dashboard.service";
import { useAuth } from "@/hooks/use-auth";
import type { DashboardOverview } from "@/types/dashboard";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/page-header";
import { MetricCard } from "@/components/common/metric-card";
import { ModuleNote } from "@/components/common/module-note";
import { RoleGuard } from "@/components/auth/role-guard";

function DashboardSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

/*
 * Normalizamos datos para evitar NaN, undefined o errores visuales
 * si algún valor del backend viene vacío.
 */
function normalizeOverview(data: DashboardOverview | null): DashboardOverview {
  return {
    totalCustomers: Number(data?.totalCustomers ?? 0),
    totalVehicles: Number(data?.totalVehicles ?? 0),
    activeOrders: Number(data?.activeOrders ?? 0),
    overdueOrders: Number(data?.overdueOrders ?? 0),
    completedOrders: Number(data?.completedOrders ?? 0),
    lowStockParts: Number(data?.lowStockParts ?? 0),
    pendingQuotes: Number(data?.pendingQuotes ?? 0),
    monthlyRevenue: Number(data?.monthlyRevenue ?? 0),
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  const userRole = user?.role?.name ?? null;

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedOverview = useMemo(() => {
    return normalizeOverview(overview);
  }, [overview]);

  const operationalHealth = useMemo(() => {
    const totalOrders =
      normalizedOverview.activeOrders +
      normalizedOverview.completedOrders +
      normalizedOverview.overdueOrders;

    const completedPercentage =
      totalOrders > 0
        ? Math.round((normalizedOverview.completedOrders / totalOrders) * 100)
        : 0;

    return {
      totalOrders,
      completedPercentage,
      needsAttention:
        normalizedOverview.overdueOrders > 0 ||
        normalizedOverview.lowStockParts > 0 ||
        normalizedOverview.pendingQuotes > 0,
    };
  }, [normalizedOverview]);

  const quickActions = [
    {
      label: "Nuevo cliente",
      href: "/dashboard/customers/new",
      icon: Users,
      permission: "customers.create" as const,
    },
    {
      label: "Nueva orden",
      href: "/dashboard/work-orders/new",
      icon: ClipboardList,
      permission: "workOrders.create" as const,
    },
    {
      label: "Nueva cotización",
      href: "/dashboard/quotes/new",
      icon: FileText,
      permission: "quotes.create" as const,
    },
    {
      label: "Registrar pago",
      href: "/dashboard/payments/new",
      icon: CreditCard,
      permission: "payments.create" as const,
    },
    {
      label: "Abrir caja",
      href: "/dashboard/cash-registers",
      icon: Wallet,
      permission: "cashRegisters.open" as const,
    },
  ].filter((action) => hasPermission(userRole, action.permission));

  async function loadDashboard(showToast = false): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const data = await dashboardService.getOverview();
      setOverview(data);

      if (showToast) {
        toast.success("Dashboard actualizado");
      }
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh(): Promise<void> {
    try {
      setIsRefreshing(true);
      await loadDashboard(true);
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <RoleGuard permissions={["dashboard.view"]}>
      <div className="space-y-5">
        <PageHeader
          title="Dashboard"
          description="Resumen operativo, comercial y financiero del taller mecánico."
          badge="Panel general"
          icon={Wrench}
          actions={
            <Button
              disabled={isRefreshing}
              type="button"
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          }
        />

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? <DashboardSkeleton /> : null}

        {!isLoading ? (
          <>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Clientes"
                value={normalizedOverview.totalCustomers}
                description="Registrados"
                icon={Users}
              />

              <MetricCard
                title="Vehículos"
                value={normalizedOverview.totalVehicles}
                description="En el sistema"
                icon={Car}
              />

              <MetricCard
                title="Órdenes activas"
                value={normalizedOverview.activeOrders}
                description="Trabajos en proceso"
                icon={ClipboardList}
              />

              <MetricCard
                title="Órdenes atrasadas"
                value={normalizedOverview.overdueOrders}
                description="Requieren atención"
                icon={AlertTriangle}
              />

              <MetricCard
                title="Completadas"
                value={normalizedOverview.completedOrders}
                description="Finalizadas o entregadas"
                icon={ClipboardList}
              />

              <MetricCard
                title="Stock bajo"
                value={normalizedOverview.lowStockParts}
                description="Repuestos por reponer"
                icon={Package}
              />

              <MetricCard
                title="Cotizaciones pendientes"
                value={normalizedOverview.pendingQuotes}
                description="Borradores o enviadas"
                icon={FileText}
              />

              <MetricCard
                title="Ingresos del mes"
                value={formatCurrency(normalizedOverview.monthlyRevenue)}
                description="Pagos registrados"
                icon={DollarSign}
              />
            </div>

            {operationalHealth.needsAttention ? (
              <ModuleNote
                title="Hay puntos que requieren atención"
                description="Revisa órdenes atrasadas, cotizaciones pendientes o repuestos con stock bajo para mantener el flujo del taller estable."
                icon={AlertTriangle}
                variant="warning"
              />
            ) : (
              <ModuleNote
                title="Operación estable"
                description="No se detectan alertas críticas en órdenes, stock o cotizaciones pendientes dentro del resumen actual."
                icon={Wrench}
                variant="success"
              />
            )}

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">Flujo del taller</h2>
                      <p className="text-sm text-muted-foreground">
                        Vista rápida del proceso principal.
                      </p>
                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {operationalHealth.completedPercentage}% completado
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <FlowStep
                      title="Clientes"
                      value={normalizedOverview.totalCustomers}
                      description="Base comercial"
                    />

                    <FlowStep
                      title="Vehículos"
                      value={normalizedOverview.totalVehicles}
                      description="Unidades registradas"
                    />

                    <FlowStep
                      title="Órdenes"
                      value={operationalHealth.totalOrders}
                      description="Flujo operativo"
                    />

                    <FlowStep
                      title="Ingresos"
                      value={formatCurrency(normalizedOverview.monthlyRevenue)}
                      description="Mes actual"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h2 className="font-semibold">Acciones rápidas</h2>
                    <p className="text-sm text-muted-foreground">
                      Atajos según tu rol.
                    </p>
                  </div>

                  {quickActions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                      Tu rol no tiene acciones rápidas disponibles.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                          <Button
                            key={action.href}
                            asChild
                            variant="outline"
                            className="justify-start"
                          >
                            <Link href={action.href}>
                              <Icon className="mr-2 h-4 w-4" />
                              {action.label}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </RoleGuard>
  );
}

interface FlowStepProps {
  title: string;
  value: string | number;
  description: string;
}

function FlowStep({ title, value, description }: FlowStepProps) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-4">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
