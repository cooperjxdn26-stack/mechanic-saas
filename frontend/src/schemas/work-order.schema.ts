import { z } from "zod";

export const workOrderSchema = z.object({
  /*
   * Motivo principal de ingreso del vehículo.
   */
  reason: z
    .string()
    .min(3, "El motivo debe tener mínimo 3 caracteres")
    .max(200, "El motivo es demasiado largo"),

  reportedSymptoms: z.string().optional(),
  initialDiagnosis: z.string().optional(),
  internalNotes: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),

  /*
   * Fecha estimada opcional.
   * El input datetime-local envía string local, luego lo convertimos a ISO.
   */
  estimatedDelivery: z.string().optional(),

  /*
   * Toda orden debe estar asociada a un vehículo.
   */
  vehicleId: z.string().min(1, "Selecciona un vehículo"),
});

export type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export const checklistSchema = z.object({
  item: z
    .string()
    .min(3, "El item debe tener mínimo 3 caracteres")
    .max(150, "El item es demasiado largo"),

  status: z.enum(["PENDING", "PASSED", "FAILED", "WARNING"]).default("PENDING"),

  notes: z.string().optional(),
});

export type ChecklistFormValues = z.infer<typeof checklistSchema>;

export function toIsoDateTime(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

export function toDateTimeLocal(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  /*
   * datetime-local necesita formato YYYY-MM-DDTHH:mm.
   */
  return date.toISOString().slice(0, 16);
}
