import { z } from "zod";

export const purchaseItemSchema = z.object({
  /*
   * Cada item de compra debe estar asociado a un repuesto.
   */
  partId: z.string().min(1, "Selecciona un repuesto"),

  quantity: z.coerce.number().min(1, "La cantidad debe ser mínimo 1"),

  unitPrice: z.coerce
    .number()
    .min(0, "El precio unitario no puede ser negativo"),
});

export const purchaseSchema = z.object({
  /*
   * Si la compra se crea como RECEIVED, el backend aumentará stock automáticamente.
   */
  status: z
    .enum(["DRAFT", "ORDERED", "RECEIVED", "CANCELLED"])
    .default("DRAFT"),

  supplierId: z.string().optional(),

  tax: z.coerce.number().min(0, "El impuesto no puede ser negativo").default(0),

  notes: z.string().optional(),

  items: z
    .array(purchaseItemSchema)
    .min(1, "La compra debe tener al menos un item"),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export function normalizeSupplierId(value?: string): string | undefined {
  if (!value || value === "NONE") {
    return undefined;
  }

  return value;
}
