import { z } from "zod";

export const customerSchema = z.object({
  type: z.enum(["NATURAL", "COMPANY"]).default("NATURAL"),
  status: z.enum(["ACTIVE", "INACTIVE", "VIP", "DEBTOR"]).default("ACTIVE"),

  name: z
    .string()
    .min(2, "El nombre debe tener mínimo 2 caracteres")
    .max(120, "El nombre es demasiado largo"),

  documentNumber: z.string().optional(),
  phone: z.string().optional(),

  email: z
    .string()
    .email("Ingresa un correo válido")
    .optional()
    .or(z.literal("")),

  address: z.string().optional(),
  notes: z.string().optional(),

  tagsText: z.string().optional(),

  trustLevel: z.coerce
    .number()
    .min(0, "El nivel mínimo es 0")
    .max(10, "El nivel máximo es 10")
    .default(0),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export function parseTags(tagsText?: string): string[] {
  if (!tagsText) {
    return [];
  }

  return tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function tagsToText(tags?: string[]): string {
  if (!tags || tags.length === 0) {
    return "";
  }

  return tags.join(", ");
}
