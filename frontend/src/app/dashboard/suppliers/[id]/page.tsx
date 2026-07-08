"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { suppliersService } from "@/services/suppliers.service";
import type { Supplier } from "@/types/supplier";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupplierDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSupplier(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await suppliersService.findOne(id);
        setSupplier(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadSupplier();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/suppliers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de proveedor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Repuestos asociados y compras recientes.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-80 rounded-2xl" /> : null}

      {!isLoading && supplier ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  {supplier.name}
                  <Badge>{supplier.isActive ? "Activo" : "Inactivo"}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Registrado el {formatDate(supplier.createdAt)}
                </p>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-2">
                <Info label="RUC" value={supplier.ruc ?? "Sin RUC"} />
                <Info
                  label="Teléfono"
                  value={supplier.phone ?? "Sin teléfono"}
                />
                <Info label="Correo" value={supplier.email ?? "Sin correo"} />
                <Info
                  label="Contacto"
                  value={supplier.contactName ?? "Sin contacto"}
                />
                <Info
                  label="Dirección"
                  value={supplier.address ?? "Sin dirección"}
                />
                <Info label="Notas" value={supplier.notes ?? "Sin notas"} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Repuestos del proveedor</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {!supplier.parts || supplier.parts.length === 0 ? (
                  <Empty message="No hay repuestos asociados." />
                ) : (
                  supplier.parts.map((part) => (
                    <Link
                      key={part.id}
                      href={`/dashboard/parts/${part.id}`}
                      className="block rounded-xl border p-4 transition hover:bg-muted"
                    >
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {part.stock} · Venta:{" "}
                        {formatCurrency(Number(part.salePrice))}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit rounded-2xl">
            <CardHeader>
              <CardTitle>Compras recientes</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {!supplier.purchases || supplier.purchases.length === 0 ? (
                <Empty message="No hay compras registradas." />
              ) : (
                supplier.purchases.map((purchase) => (
                  <Link
                    key={purchase.id}
                    href={`/dashboard/purchases/${purchase.id}`}
                    className="block rounded-xl border p-4 transition hover:bg-muted"
                  >
                    <p className="font-medium">{purchase.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.status} ·{" "}
                      {formatCurrency(Number(purchase.total))}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
