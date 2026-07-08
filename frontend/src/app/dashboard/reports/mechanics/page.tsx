"use client";

import { useEffect, useState } from "react";
import { CheckCircle, UserCog, Users, Wrench } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { reportsService } from "@/services/reports.service";
import type { MechanicsReportResponse } from "@/types/report";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

export default function MechanicsReportPage() {
  const [report, setReport] = useState<MechanicsReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        /*
         * El backend devuelve rows con el rendimiento de cada mecánico.
         */
        const response = await reportsService.mechanics();

        setReport(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadReport();
  }, []);

  const mechanics = report?.rows ?? [];

  /*
   * Valores seguros para las tarjetas.
   */
  const mechanicsCount = mechanics.length;

  const totalOrders = mechanics.reduce((acc, mechanic) => {
    return acc + Number(mechanic.totalOrders ?? 0);
  }, 0);

  const completedOrders = mechanics.reduce((acc, mechanic) => {
    return acc + Number(mechanic.completedOrders ?? 0);
  }, 0);

  const activeOrders = mechanics.reduce((acc, mechanic) => {
    return acc + Number(mechanic.activeOrders ?? 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporte de mecánicos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Rendimiento y carga de trabajo por técnico.
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
              title="Mecánicos"
              value={mechanicsCount}
              description="Técnicos registrados"
              icon={Users}
            />

            <ReportCard
              title="Órdenes asignadas"
              value={totalOrders}
              description="Total de trabajos asignados"
              icon={Wrench}
            />

            <ReportCard
              title="Completadas"
              value={completedOrders}
              description="Trabajos finalizados"
              icon={CheckCircle}
            />

            <ReportCard
              title="Activas"
              value={activeOrders}
              description="Trabajos en proceso"
              icon={UserCog}
            />
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mecánico</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Total órdenes</TableHead>
                      <TableHead>Completadas</TableHead>
                      <TableHead>Activas</TableHead>
                      <TableHead>Eficiencia</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {mechanics.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No hay datos de mecánicos.
                        </TableCell>
                      </TableRow>
                    ) : (
                      mechanics.map((item) => {
                        const total = Number(item.totalOrders ?? 0);
                        const completed = Number(item.completedOrders ?? 0);

                        /*
                         * Eficiencia calculada en frontend:
                         * completadas / total asignadas.
                         */
                        const efficiency =
                          total > 0 ? Math.round((completed / total) * 100) : 0;

                        return (
                          <TableRow key={`${item.mechanic}-${item.email}`}>
                            <TableCell className="font-medium">
                              {item.mechanic}
                            </TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.totalOrders}</TableCell>
                            <TableCell>{item.completedOrders}</TableCell>
                            <TableCell>{item.activeOrders}</TableCell>
                            <TableCell>{efficiency}%</TableCell>
                          </TableRow>
                        );
                      })
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
