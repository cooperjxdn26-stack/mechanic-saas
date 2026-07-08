import { z } from "zod";

export const partSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener mínimo 2 caracteres")
    .max(150, "El nombre es demasiado largo"),

  code: z.string().optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),

  /*
   * Stock inicial. El backend creará movimiento Kardex si es mayor a 0.
   */
  stock: z.coerce.number().min(0, "El stock no puede ser negativo").default(0),

  minStock: z.coerce
    .number()
    .min(0, "El stock mínimo no puede ser negativo")
    .default(0),

  purchasePrice: z.coerce
    .number()
    .min(0, "El precio de compra no puede ser negativo")
    .default(0),

  salePrice: z.coerce
    .number()
    .min(0, "El precio de venta no puede ser negativo")
    .default(0),

  location: z.string().optional(),
  supplierId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type PartFormValues = z.infer<typeof partSchema>;

export const movementSchema = z.object({
  /*
   * ADJUSTMENT reemplaza el stock actual con la cantidad enviada.
   * IN/RETURN suman, OUT/LOSS restan.
   */
  type: z.enum(["IN", "OUT", "ADJUSTMENT", "RETURN", "LOSS"]),

  quantity: z.coerce.number().min(1, "La cantidad debe ser mínimo 1"),

  reason: z.string().optional(),
  reference: z.string().optional(),
});

export type MovementFormValues = z.infer<typeof movementSchema>;
