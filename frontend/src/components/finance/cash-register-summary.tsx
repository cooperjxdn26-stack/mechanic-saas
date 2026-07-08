"use client";

import { formatCurrency } from "@/lib/format";
import type { CashRegisterSummary } from "@/types/cash-register";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CashRegisterSummaryProps {
  summary: CashRegisterSummary;
}

export function CashRegisterSummary({ summary }: CashRegisterSummaryProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Resumen de caja</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Info
            label="Apertura"
            value={formatCurrency(summary.openingAmount)}
          />
          <Info label="Pagos" value={formatCurrency(summary.paymentsTotal)} />
          <Info
            label="Esperado"
            value={formatCurrency(summary.expectedAmount)}
          />
          <Info
            label="Cierre"
            value={
              summary.closingAmount === null
                ? "Pendiente"
                : formatCurrency(summary.closingAmount)
            }
          />
          <Info
            label="Diferencia"
            value={
              summary.difference === null
                ? "Pendiente"
                : formatCurrency(summary.difference)
            }
          />
          <Info label="Pagos registrados" value={summary.paymentsCount} />
        </div>

        <div className="rounded-xl border p-4">
          <p className="mb-3 font-medium">Por método de pago</p>

          {Object.keys(summary.byMethod).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin pagos registrados.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(summary.byMethod).map(([method, total]) => (
                <Info
                  key={method}
                  label={method}
                  value={formatCurrency(total)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: string | number;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
