"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, FileText, TrendingUp } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { reportsService } from "@/services/reports.service";
import type { FinancialReport } from "@/types/report";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/report-card";

export default function FinancialReportPage() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * El backend devuelve los totales financieros dentro de summary.
         */
        const response = await reportsService.financial();

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
   * Valores seguros.
   * Evitamos NaN si algún valor llega undefined.
   */
  const paidTotal = Number(report?.summary?.paidTotal ?? 0);
  const invoicedTotal = Number(report?.summary?.invoicedTotal ?? 0);
  const quotedTotal = Number(report?.summary?.quotedTotal ?? 0);
  const pendingCollection = Number(report?.summary?.pendingCollection ?? 0);

  const paymentsCount = Number(report?.summary?.paymentsCount ?? 0);
  const invoicesCount = Number(report?.summary?.invoicesCount ?? 0);
  const quotesCount = Number(report?.summary?.quotesCount ?? 0);

  /*
   * Utilidad calculada básica.
   * En este reporte actual no tenemos egresos reales,
   * por eso mostramos lo cobrado como utilidad operativa temporal.
   */
  const estimatedProfit = paidTotal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporte financiero
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ingresos, facturación, cotizaciones y pendientes de cobro.
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
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title="Cobrado"
              value={formatCurrency(paidTotal)}
              description={`${paymentsCount} pagos registrados`}
              icon={CreditCard}
            />

            <ReportCard
              title="Facturado"
              value={formatCurrency(invoicedTotal)}
              description={`${invoicesCount} facturas emitidas`}
              icon={FileText}
            />

            <ReportCard
              title="Cotizado"
              value={formatCurrency(quotedTotal)}
              description={`${quotesCount} cotizaciones registradas`}
              icon={DollarSign}
            />

            <ReportCard
              title="Pendiente"
              value={formatCurrency(pendingCollection)}
              description="Facturado aún no cobrado"
              icon={TrendingUp}
            />
          </div>

          <Card className="rounded-2xl">
            <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
              <FinancialBox
                label="Pagos"
                value={paymentsCount}
                description="Cantidad de pagos registrados"
              />

              <FinancialBox
                label="Facturas"
                value={invoicesCount}
                description="Cantidad de facturas emitidas"
              />

              <FinancialBox
                label="Cotizaciones"
                value={quotesCount}
                description="Cantidad de cotizaciones creadas"
              />

              <FinancialBox
                label="Utilidad estimada"
                value={formatCurrency(estimatedProfit)}
                description="Basado en cobros registrados"
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

interface FinancialBoxProps {
  label: string;
  value: string | number;
  description: string;
}

function FinancialBox({ label, value, description }: FinancialBoxProps) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
