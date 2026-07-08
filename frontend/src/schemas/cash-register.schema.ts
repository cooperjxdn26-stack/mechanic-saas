import { z } from "zod";

export const openCashRegisterSchema = z.object({
  /*
   * Monto físico inicial de caja.
   */
  openingAmount: z.coerce
    .number()
    .min(0, "El monto inicial no puede ser negativo"),

  notes: z.string().optional(),
});

export const closeCashRegisterSchema = z.object({
  /*
   * Monto físico contado al cierre.
   * El backend calcula diferencia contra monto esperado.
   */
  closingAmount: z.coerce
    .number()
    .min(0, "El monto de cierre no puede ser negativo"),

  notes: z.string().optional(),
});

export type OpenCashRegisterFormValues = z.infer<typeof openCashRegisterSchema>;
export type CloseCashRegisterFormValues = z.infer<
  typeof closeCashRegisterSchema
>;
