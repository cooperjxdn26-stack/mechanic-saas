import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(2, "El proveedor debe tener mínimo 2 caracteres")
    .max(150, "El nombre es demasiado largo"),

  ruc: z.string().optional(),
  phone: z.string().optional(),

  email: z
    .string()
    .email("Ingresa un correo válido")
    .optional()
    .or(z.literal("")),

  address: z.string().optional(),
  contactName: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
