import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  DollarSign,
  Package,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const reportLinks = [
  {
    title: "Ventas",
    description: "Facturas, pagos, ticket promedio e ingresos.",
    href: "/dashboard/reports/sales",
    icon: DollarSign,
  },
  {
    title: "Inventario",
    description: "Stock, repuestos bajos y valor de inventario.",
    href: "/dashboard/reports/inventory",
    icon: Package,
  },
  {
    title: "Órdenes",
    description: "Órdenes activas, completadas y atrasadas.",
    href: "/dashboard/reports/work-orders",
    icon: ClipboardList,
  },
  {
    title: "Financiero",
    description: "Ingresos, egresos, utilidad y pendientes.",
    href: "/dashboard/reports/financial",
    icon: BarChart3,
  },
  {
    title: "Mecánicos",
    description: "Rendimiento y carga de trabajo por mecánico.",
    href: "/dashboard/reports/mechanics",
    icon: Users,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="mt-1 text-muted-foreground">
          Panel de reportes operativos, comerciales y financieros.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportLinks.map((report) => {
          const Icon = report.icon;

          return (
            <Card key={report.href} className="rounded-2xl">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{report.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>

                <Button asChild variant="outline">
                  <Link href={report.href}>Ver reporte</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
