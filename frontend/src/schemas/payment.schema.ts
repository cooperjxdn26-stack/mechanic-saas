import { z } from "zod";

export const paymentSchema = z.object({
  method: z.enum([
    "CASH",
    "CARD",
    "TRANSFER",
    "YAPE",
    "PLIN",
    "POS",
    "CREDIT",
    "OTHER",
  ]),

  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).default("PAID"),

  /*
   * El backend valida que no se pague más del saldo pendiente.
   */
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a cero"),

  reference: z.string().optional(),
  notes: z.string().optional(),

  customerId: z.string().optional(),
  invoiceId: z.string().optional(),
  cashRegisterId: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export function normalizeOptionalId(value?: string): string | undefined {
  if (!value || value === "NONE") {
    return undefined;
  }

  return value;
}
