import { Badge } from "@/components/ui/badge";

type StatusBadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface StatusBadgeProps {
  value?: string | null;
}

/*
 * Traducciones visuales para estados usados en el sistema.
 * El backend sigue trabajando con los valores reales:
 * ACTIVE, INACTIVE, PENDING, RECEIVED, etc.
 */
const statusLabels: Record<string, string> = {
  // Estados generales
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  VIP: "VIP",
  DEBTOR: "Deudor",

  // Órdenes de trabajo
  PENDING: "Pendiente",
  RECEIVED: "Recibido",
  IN_DIAGNOSIS: "Diagnóstico",
  WAITING_APPROVAL: "Esperando aprobación",
  IN_REPAIR: "Reparación",
  IN_TESTING: "Prueba",
  COMPLETED: "Finalizado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",

  // Pagos / facturas / cotizaciones
  PAID: "Pagado",
  PARTIAL: "Parcial",
  UNPAID: "Pendiente",
  ISSUED: "Emitido",
  DRAFT: "Borrador",
  SENT: "Enviado",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",

  // Inventario / notificaciones
  READ: "Leída",
  FAILED: "Fallida",
  LOW_STOCK: "Stock bajo",

  // Continuidad / Backups
  SUCCESS: "Exitoso",
  RUNNING: "Ejecutándose",
  RESTORED: "Restaurado",
};

const statusVariants: Record<string, StatusBadgeVariant> = {
  ACTIVE: "default",
  VIP: "default",
  PAID: "default",
  ACCEPTED: "default",
  COMPLETED: "default",
  DELIVERED: "default",
  READ: "secondary",

  PENDING: "secondary",
  RECEIVED: "secondary",
  IN_DIAGNOSIS: "secondary",
  WAITING_APPROVAL: "secondary",
  IN_REPAIR: "secondary",
  IN_TESTING: "secondary",
  PARTIAL: "secondary",
  DRAFT: "secondary",
  SENT: "secondary",
  ISSUED: "secondary",

  INACTIVE: "outline",
  UNPAID: "outline",

  DEBTOR: "destructive",
  CANCELLED: "destructive",
  REJECTED: "destructive",
  FAILED: "destructive",
  LOW_STOCK: "destructive",

  // Continuidad / Backups
  SUCCESS: "default",
  RUNNING: "secondary",
  RESTORED: "outline",
};

function normalizeStatus(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(value);

  const label =
    statusLabels[normalizedStatus] ||
    normalizedStatus.replace(/_/g, " ") ||
    "Sin estado";

  const variant = statusVariants[normalizedStatus] ?? "outline";

  return <Badge variant={variant}>{label}</Badge>;
}
