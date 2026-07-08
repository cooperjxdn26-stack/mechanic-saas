import { CalendarClock, ClipboardList, Wrench } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { VehicleHistory as VehicleHistoryType } from "@/types/vehicle";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleHistoryProps {
  history: VehicleHistoryType;
}

export function VehicleHistory({ history }: VehicleHistoryProps) {
  const workOrders = history.workOrders ?? [];
  const reminders = history.maintenanceReminders ?? [];
  const appointments = history.appointments ?? [];

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Historial de órdenes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {workOrders.length === 0 ? (
            <EmptyHistory message="No hay órdenes registradas para este vehículo." />
          ) : (
            workOrders.map((order) => (
              <div key={order.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <ClipboardList className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-medium">{order.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.reason}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge>{order.status}</Badge>
                    <Badge variant="outline">{order.priority}</Badge>
                  </div>
                </div>

                {order.diagnostics && order.diagnostics.length > 0 ? (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {order.diagnostics.map((diagnostic) => (
                      <div
                        key={diagnostic.id}
                        className="rounded-lg bg-muted/40 p-3"
                      >
                        <p className="text-sm font-medium">
                          {diagnostic.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {diagnostic.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recordatorios de mantenimiento</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {reminders.length === 0 ? (
            <EmptyHistory message="No hay recordatorios de mantenimiento." />
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-start gap-3 rounded-xl border p-4"
              >
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Wrench className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.description ?? "Sin descripción"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estado: {reminder.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Citas</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {appointments.length === 0 ? (
            <EmptyHistory message="No hay citas registradas." />
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start gap-3 rounded-xl border p-4"
              >
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(appointment.startAt)} -{" "}
                    {formatDateTime(appointment.endAt)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estado: {appointment.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface EmptyHistoryProps {
  message: string;
}

function EmptyHistory({ message }: EmptyHistoryProps) {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
