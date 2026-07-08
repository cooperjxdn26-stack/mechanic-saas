"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { partsService } from "@/services/parts.service";
import type { Part } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MovementForm } from "@/components/inventory/movement-form";

export default function PartDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [part, setPart] = useState<Part | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPart(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partsService.findOne(id);
      setPart(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPart();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/parts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de repuesto
          </h1>
          <p className="mt-1 text-muted-foreground">
            Información, stock y movimientos.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-80 rounded-2xl" /> : null}

      {!isLoading && part ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{part.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Registrado el {formatDate(part.createdAt)}
                  </p>
                </div>

                <Button asChild>
                  <Link href={`/dashboard/parts/${part.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{part.isActive ? "Activo" : "Inactivo"}</Badge>
                  {part.stock <= part.minStock ? (
                    <Badge variant="destructive">Stock bajo</Badge>
                  ) : null}
                  {part.category ? (
                    <Badge variant="outline">{part.category}</Badge>
                  ) : null}
                  {part.brand ? (
                    <Badge variant="outline">{part.brand}</Badge>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Info label="SKU" value={part.sku ?? "Sin SKU"} />
                  <Info label="Código" value={part.code ?? "Sin código"} />
                  <Info label="Stock" value={part.stock} />
                  <Info label="Stock mínimo" value={part.minStock} />
                  <Info
                    label="Precio compra"
                    value={formatCurrency(Number(part.purchasePrice))}
                  />
                  <Info
                    label="Precio venta"
                    value={formatCurrency(Number(part.salePrice))}
                  />
                  <Info
                    label="Ubicación"
                    value={part.location ?? "Sin ubicación"}
                  />
                  <Info
                    label="Proveedor"
                    value={part.supplier?.name ?? "Sin proveedor"}
                  />
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm font-medium">Descripción</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {part.description ?? "Sin descripción"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <MovementForm partId={part.id} onCreated={loadPart} />
          </div>

          <Card className="h-fit rounded-2xl">
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/parts/${part.id}/kardex`}>
                  Ver Kardex
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
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
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
