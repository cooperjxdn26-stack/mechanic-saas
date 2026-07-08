import { formatDateTime } from "@/lib/format";
import type { InventoryMovement } from "@/types/inventory";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KardexTableProps {
  movements: InventoryMovement[];
}

function movementLabel(type: InventoryMovement["type"]): string {
  const labels: Record<InventoryMovement["type"], string> = {
    IN: "Entrada",
    OUT: "Salida",
    ADJUSTMENT: "Ajuste",
    RETURN: "Devolución",
    LOSS: "Pérdida",
  };

  return labels[type];
}

export function KardexTable({ movements }: KardexTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Kardex del repuesto</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Stock anterior</TableHead>
                <TableHead>Stock nuevo</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No hay movimientos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{formatDateTime(movement.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {movementLabel(movement.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.previousStock}</TableCell>
                    <TableCell>{movement.newStock}</TableCell>
                    <TableCell>
                      {movement.reference ?? "Sin referencia"}
                    </TableCell>
                    <TableCell>{movement.reason ?? "Sin motivo"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
