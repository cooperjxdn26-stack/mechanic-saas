"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, FileText, Receipt } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { reportsService } from "@/services/reports.service";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/report-card";

/*
 * Fila que devuelve el backend dentro de rows.
 */
interface SalesReportRow {
  code: string;
  date: string | Date | null;
  customer: string | null;
  invoice: string | null;
  method: string;
  amount: number;
  cashier: string | null;
}

/*
 * Estructura real del reporte de ventas que devuelve el backend.
 */
interface SalesReportResponse {
  title: string;
  filters: unknown;
  summary: {
    total: number;
    count: number;
    byMethod: Record<string, number>;
  };
  rows: SalesReportRow[];
}

export default function SalesReportPage() {
  const [report, setReport] = useState<SalesReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * El backend calcula los datos reales.
         * El frontend solo presenta los resultados.
         */
        const response = (await reportsService.sales()) as SalesReportResponse;

        setReport(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadReport();
  }, []);

  /*
   * Valores seguros para evitar NaN.
   * El backend devuelve:
   * - summary.total
   * - summary.count
   * - rows
   */
  const totalSales = Number(report?.summary?.total ?? 0);
  const totalPayments = Number(report?.summary?.total ?? 0);
  const paymentsCount = Number(report?.summary?.count ?? 0);

  /*
   * Cantidad de facturas asociadas a pagos.
   */
  const totalInvoices =
    report?.rows?.filter((item) => Boolean(item.invoice)).length ?? 0;

  /*
   * Ticket promedio seguro.
   * Si no hay pagos, mostramos 0.
   */
  const averageTicket = paymentsCount > 0 ? totalSales / paymentsCount : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporte de ventas</h1>
        <p className="mt-1 text-muted-foreground">
          Resumen comercial del taller.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : report ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportCard
            title="Ventas"
            value={formatCurrency(totalSales)}
            description="Ingresos facturados"
            icon={DollarSign}
          />

          <ReportCard
            title="Facturas"
            value={totalInvoices}
            description="Facturas asociadas a pagos"
            icon={Receipt}
          />

          <ReportCard
            title="Pagos"
            value={formatCurrency(totalPayments)}
            description="Pagos registrados"
            icon={CreditCard}
          />

          <ReportCard
            title="Ticket promedio"
            value={formatCurrency(averageTicket)}
            description="Promedio por pago"
            icon={FileText}
          />
        </div>
      ) : null}
    </div>
  );
}
