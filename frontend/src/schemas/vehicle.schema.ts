import { z } from "zod";

export const vehicleSchema = z.object({
  /*
   * La placa se normaliza luego a mayúsculas antes de enviarla al backend.
   */
  plate: z
    .string()
    .min(3, "La placa debe tener mínimo 3 caracteres")
    .max(20, "La placa es demasiado larga"),

  brand: z
    .string()
    .min(2, "La marca debe tener mínimo 2 caracteres")
    .max(80, "La marca es demasiado larga"),

  model: z
    .string()
    .min(1, "El modelo es obligatorio")
    .max(80, "El modelo es demasiado largo"),

  year: z.coerce
    .number()
    .min(1900, "El año mínimo es 1900")
    .max(new Date().getFullYear() + 1, "El año no puede ser tan alto")
    .optional()
    .or(z.literal("")),

  color: z.string().optional(),
  vin: z.string().optional(),

  mileage: z.coerce
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .default(0),

  fuelType: z
    .enum(["GASOLINE", "DIESEL", "GAS", "HYBRID", "ELECTRIC", "OTHER"])
    .optional(),

  transmission: z.enum(["MANUAL", "AUTOMATIC", "CVT", "OTHER"]).optional(),

  type: z
    .enum(["SEDAN", "SUV", "PICKUP", "VAN", "TRUCK", "MOTORCYCLE", "OTHER"])
    .optional(),

  notes: z.string().optional(),

  /*
   * customerId es obligatorio porque cada vehículo pertenece a un cliente.
   */
  customerId: z.string().min(1, "Selecciona un cliente"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

export function toOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value === null || typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  return undefined;
}
