import { z } from "zod";

export const quoteItemSchema = z.object({
  /*
   * SERVICE y PART pueden asociarse a catálogos reales.
   * LABOR y EXTRA permiten conceptos manuales.
   */
  type: z.enum(["SERVICE", "PART", "LABOR", "EXTRA"]),

  description: z
    .string()
    .min(2, "La descripción debe tener mínimo 2 caracteres"),

  quantity: z.coerce.number().min(1, "La cantidad debe ser mínimo 1"),

  unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),

  discount: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo")
    .default(0),

  serviceId: z.string().optional(),
  partId: z.string().optional(),
});

export const quoteSchema = z.object({
  status: z
    .enum(["DRAFT", "SENT", "APPROVED", "REJECTED", "CONVERTED"])
    .default("DRAFT"),

  customerId: z.string().min(1, "Selecciona un cliente"),

  vehicleId: z.string().optional(),
  workOrderId: z.string().optional(),

  discount: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo")
    .default(0),

  tax: z.coerce.number().min(0, "El impuesto no puede ser negativo").default(0),

  validUntil: z.string().optional(),
  notes: z.string().optional(),

  /*
   * Toda cotización necesita al menos un item.
   */
  items: z
    .array(quoteItemSchema)
    .min(1, "La cotización debe tener al menos un item"),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export function normalizeOptionalId(value?: string): string | undefined {
  if (!value || value === "NONE") {
    return undefined;
  }

  return value;
}

export function toIsoDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

export function toDateInput(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}
