import Link from "next/link";
import { Car, Pencil, User } from "lucide-react";

import { routes } from "@/config/routes";
import { formatDateTime } from "@/lib/format";
import type { WorkOrder } from "@/types/work-order";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkOrderStatusSelect } from "./work-order-status-select";

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onRefresh: () => Promise<void>;
}

export function WorkOrderDetail({
  workOrder,
  onRefresh,
}: WorkOrderDetailProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                {workOrder.code}
                <Badge variant="outline">{workOrder.priority}</Badge>
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {workOrder.reason}
              </p>
            </div>

            <Button asChild>
              <Link href={`${routes.workOrders}/${workOrder.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <WorkOrderStatusSelect
                value={workOrder.status}
                workOrderId={workOrder.id}
                onChanged={onRefresh}
              />

              <Badge variant="secondary">
                Recibido: {formatDateTime(workOrder.receivedAt)}
              </Badge>

              <Badge variant="secondary">
                Entrega: {formatDateTime(workOrder.estimatedDelivery)}
              </Badge>
            </div>

            <InfoBlock
              title="Síntomas reportados"
              value={workOrder.reportedSymptoms}
            />

            <InfoBlock
              title="Diagnóstico inicial"
              value={workOrder.initialDiagnosis}
            />

            <InfoBlock title="Notas internas" value={workOrder.internalNotes} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Checklist de inspección</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {!workOrder.checklists || workOrder.checklists.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay checklist registrado.
              </div>
            ) : (
              workOrder.checklists.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border p-4"
                >
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.notes ?? "Sin notas"}
                    </p>
                  </div>

                  <Badge>{item.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Diagnósticos</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {!workOrder.diagnostics || workOrder.diagnostics.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay diagnósticos registrados.
              </div>
            ) : (
              workOrder.diagnostics.map((diagnostic) => (
                <div key={diagnostic.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{diagnostic.title}</p>
                    <Badge variant="outline">{diagnostic.type}</Badge>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {diagnostic.description}
                  </p>

                  {diagnostic.solution ? (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Solución:</span>{" "}
                      {diagnostic.solution}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Vehículo</CardTitle>
          </CardHeader>

          <CardContent>
            {workOrder.vehicle ? (
              <Link
                href={`${routes.vehicles}/${workOrder.vehicle.id}`}
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
              >
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Car className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{workOrder.vehicle.plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {workOrder.vehicle.brand} {workOrder.vehicle.model}
                  </p>
                </div>
              </Link>
            ) : (
              <EmptySmall message="Sin vehículo" />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>

          <CardContent>
            {workOrder.vehicle?.customer ? (
              <Link
                href={`${routes.customers}/${workOrder.vehicle.customer.id}`}
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
              >
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">
                    {workOrder.vehicle.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workOrder.vehicle.customer.phone ?? "Sin teléfono"}
                  </p>
                </div>
              </Link>
            ) : (
              <EmptySmall message="Sin cliente" />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <SummaryItem label="Estado" value={workOrder.status} />
            <SummaryItem label="Prioridad" value={workOrder.priority} />
            <SummaryItem
              label="Checklist"
              value={workOrder.checklists?.length ?? 0}
            />
            <SummaryItem
              label="Diagnósticos"
              value={workOrder.diagnostics?.length ?? 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface InfoBlockProps {
  title: string;
  value?: string | null;
}

function InfoBlock({ title, value }: InfoBlockProps) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {value ?? "Sin información registrada."}
      </p>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function EmptySmall({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
