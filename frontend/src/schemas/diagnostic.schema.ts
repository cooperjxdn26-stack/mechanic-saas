import { z } from "zod";

export const diagnosticSchema = z.object({
  /*
   * Tipo de diagnóstico:
   * TECHNICAL será el tipo principal para mecánicos.
   */
  type: z
    .enum(["INITIAL", "TECHNICAL", "FINAL", "AI_SUGGESTED"])
    .default("TECHNICAL"),

  title: z
    .string()
    .min(3, "El título debe tener mínimo 3 caracteres")
    .max(150, "El título es demasiado largo"),

  description: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres"),

  /*
   * Campo preparado para diagnósticos sugeridos por IA.
   * Por ahora es manual, luego lo llenaremos desde un módulo IA.
   */
  aiSuggestion: z.string().optional(),

  confidence: z.coerce
    .number()
    .min(0, "La confianza mínima es 0")
    .max(100, "La confianza máxima es 100")
    .optional()
    .or(z.literal("")),

  solution: z.string().optional(),
  notes: z.string().optional(),

  /*
   * Se exige cuando se crea desde listado general.
   * En el detalle de orden lo inyectaremos automáticamente.
   */
  workOrderId: z.string().min(1, "Selecciona una orden de trabajo"),
});

export type DiagnosticFormValues = z.infer<typeof diagnosticSchema>;

export function toOptionalConfidence(value: unknown): number | undefined {
  if (value === "" || value === null || typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  return undefined;
}
