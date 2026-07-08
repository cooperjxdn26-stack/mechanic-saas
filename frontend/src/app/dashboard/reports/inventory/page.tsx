"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, DollarSign, Package } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { reportsService } from "@/services/reports.service";
import type { InventoryReport } from "@/types/report";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/report-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InventoryReportPage() {
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * El backend devuelve:
         * summary.totalParts
         * summary.lowStockCount
         * summary.totalStockValue
         * rows
         */
        const response = await reportsService.inventory();

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
   * Valores seguros para evitar NaN o undefined.
   */
  const totalParts = Number(report?.summary?.totalParts ?? 0);
  const lowStockCount = Number(report?.summary?.lowStockCount ?? 0);
  const totalStockValue = Number(report?.summary?.totalStockValue ?? 0);
  const totalRows = report?.rows?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporte de inventario
        </h1>
        <p className="mt-1 text-muted-foreground">
          Stock, repuestos bajos y valor de inventario.
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
              title="Repuestos"
              value={totalParts}
              description="Total de repuestos registrados"
              icon={Package}
            />

            <ReportCard
              title="Stock bajo"
              value={lowStockCount}
              description="Repuestos en alerta"
              icon={AlertTriangle}
            />

            <ReportCard
              title="Valor inventario"
              value={formatCurrency(totalStockValue)}
              description="Valor según precio de compra"
              icon={DollarSign}
            />

            <ReportCard
              title="Filas"
              value={totalRows}
              description="Registros encontrados"
              icon={Boxes}
            />
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Repuesto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Compra</TableHead>
                      <TableHead>Venta</TableHead>
                      <TableHead>Valor stock</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {report.rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No hay datos de inventario.
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.rows.map((item) => (
                        <TableRow
                          key={`${item.code ?? item.name}-${item.sku ?? ""}`}
                        >
                          <TableCell className="font-medium">
                            <div>
                              <p>{item.name}</p>
                              {item.brand ? (
                                <p className="text-xs text-muted-foreground">
                                  {item.brand}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>

                          <TableCell>{item.sku ?? "-"}</TableCell>
                          <TableCell>{item.category ?? "-"}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{item.minStock}</TableCell>
                          <TableCell>
                            {formatCurrency(item.purchasePrice)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.salePrice)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.stockValue)}
                          </TableCell>
                          <TableCell>{item.supplier ?? "-"}</TableCell>
                          <TableCell>
                            {item.lowStock ? (
                              <Badge variant="destructive">Stock bajo</Badge>
                            ) : (
                              <Badge variant="secondary">Correcto</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
