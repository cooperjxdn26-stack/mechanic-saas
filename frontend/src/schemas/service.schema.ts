import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener mínimo 3 caracteres")
    .max(120, "El nombre es demasiado largo"),

  description: z.string().optional(),

  category: z
    .enum([
      "MAINTENANCE",
      "REPAIR",
      "DIAGNOSIS",
      "ELECTRIC",
      "ENGINE",
      "BRAKES",
      "SUSPENSION",
      "TRANSMISSION",
      "OTHER",
    ])
    .default("OTHER"),

  basePrice: z.coerce
    .number()
    .min(0, "El precio no puede ser negativo")
    .default(0),

  estimatedTimeMinutes: z
    .union([
      z.coerce.number().min(0, "El tiempo no puede ser negativo"),
      z.literal(""),
    ])
    .optional(),

  isActive: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export function toOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value === null || typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  return undefined;
}
