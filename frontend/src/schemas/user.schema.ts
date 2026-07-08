import { z } from "zod";

/*
 * Validación para creación de usuarios.
 * Evitamos enviar datos incompletos al backend.
 */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener mínimo 2 caracteres")
    .max(80, "El nombre es demasiado largo"),

  lastName: z
    .string()
    .min(2, "El apellido debe tener mínimo 2 caracteres")
    .max(80, "El apellido es demasiado largo"),

  email: z.string().email("Ingresa un correo válido"),

  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),

  phone: z.string().optional(),

  /*
   * Usamos NONE para evitar errores de Shadcn Select con valores vacíos.
   */
  roleId: z.string().optional(),

  branchId: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function normalizeOptionalId(value?: string): string | undefined {
  if (!value || value === "NONE") {
    return undefined;
  }

  return value;
}
