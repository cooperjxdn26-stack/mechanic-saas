import Link from "next/link";
import { Car, Mail, MapPin, Phone, User, Pencil } from "lucide-react";

import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types/customer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerProfileProps {
  customer: Customer;
}

function statusLabel(status: Customer["status"]): string {
  const labels: Record<Customer["status"], string> = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    VIP: "VIP",
    DEBTOR: "Deudor",
  };

  return labels[status];
}

function typeLabel(type: Customer["type"]): string {
  const labels: Record<Customer["type"], string> = {
    NATURAL: "Persona natural",
    COMPANY: "Empresa",
  };

  return labels[type];
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Cliente registrado el {formatDate(customer.createdAt)}
              </p>
            </div>

            <Button asChild>
              <Link href={`${routes.customers}/${customer.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{statusLabel(customer.status)}</Badge>
              <Badge variant="outline">{typeLabel(customer.type)}</Badge>

              {customer.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem
                icon={User}
                label="Documento"
                value={customer.documentNumber ?? "Sin documento"}
              />
              <InfoItem
                icon={Phone}
                label="Teléfono"
                value={customer.phone ?? "Sin teléfono"}
              />
              <InfoItem
                icon={Mail}
                label="Correo"
                value={customer.email ?? "Sin correo"}
              />
              <InfoItem
                icon={MapPin}
                label="Dirección"
                value={customer.address ?? "Sin dirección"}
              />
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-medium">Observaciones</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {customer.notes ?? "Sin observaciones registradas."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Vehículos del cliente</CardTitle>
          </CardHeader>

          <CardContent>
            {!customer.vehicles || customer.vehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Este cliente aún no tiene vehículos registrados.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {customer.vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`${routes.vehicles}/${vehicle.id}`}
                    className="rounded-xl border p-4 transition hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <Car className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-medium">{vehicle.plate}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.brand} {vehicle.model}{" "}
                          {vehicle.year ? `- ${vehicle.year}` : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <SummaryItem label="Visitas" value={customer.visitCount} />
            <SummaryItem
              label="Nivel de confianza"
              value={customer.trustLevel}
            />
            <SummaryItem
              label="Deuda pendiente"
              value={`S/ ${customer.totalDebt}`}
            />
            <SummaryItem
              label="Vehículos"
              value={customer.vehicles?.length ?? 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <div className="rounded-xl bg-muted p-2">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
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
