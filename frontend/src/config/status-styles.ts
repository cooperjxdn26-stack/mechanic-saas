/*
 * Estilos centralizados para estados del sistema.
 * Esto evita repetir colores en cada tabla o card.
 */

export type StatusVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "orange"
  | "purple";

export const statusVariantClasses: Record<StatusVariant, string> = {
  default: "border-zinc-200 bg-zinc-50 text-zinc-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
};

export const workOrderStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  RECEIVED: "Recibido",
  IN_DIAGNOSIS: "Diagnóstico",
  WAITING_APPROVAL: "Esperando aprobación",
  IN_REPAIR: "Reparación",
  IN_TESTING: "Prueba",
  COMPLETED: "Finalizado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const workOrderStatusVariants: Record<string, StatusVariant> = {
  PENDING: "neutral",
  RECEIVED: "info",
  IN_DIAGNOSIS: "purple",
  WAITING_APPROVAL: "warning",
  IN_REPAIR: "orange",
  IN_TESTING: "info",
  COMPLETED: "success",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const quoteStatusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CONVERTED: "Convertida",
};

export const quoteStatusVariants: Record<string, StatusVariant> = {
  DRAFT: "neutral",
  SENT: "info",
  APPROVED: "success",
  REJECTED: "danger",
  CONVERTED: "purple",
};

export const invoiceStatusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  ISSUED: "Emitida",
  PARTIALLY_PAID: "Pago parcial",
  PAID: "Pagada",
  CANCELLED: "Anulada",
};

export const invoiceStatusVariants: Record<string, StatusVariant> = {
  DRAFT: "neutral",
  ISSUED: "info",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  CANCELLED: "danger",
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  CANCELLED: "Cancelado",
};

export const paymentStatusVariants: Record<string, StatusVariant> = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "danger",
  CANCELLED: "neutral",
};

export const cashRegisterStatusLabels: Record<string, string> = {
  OPEN: "Abierta",
  CLOSED: "Cerrada",
};

export const cashRegisterStatusVariants: Record<string, StatusVariant> = {
  OPEN: "success",
  CLOSED: "neutral",
};
