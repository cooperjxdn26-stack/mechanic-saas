"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  createUserSchema,
  normalizeOptionalId,
  type CreateUserFormValues,
} from "@/schemas/user.schema";
import { rolesService } from "@/services/roles.service";
import { usersService } from "@/services/users.service";
import type { AdminRole } from "@/types/admin";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserForm() {
  const router = useRouter();

  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(true);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      roleId: "NONE",
      branchId: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    async function loadRoles(): Promise<void> {
      try {
        setIsLoadingRoles(true);

        /*
         * Cargamos roles para asignar permisos al usuario nuevo.
         */
        const response = await rolesService.findAll();

        setRoles(Array.isArray(response) ? response : []);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
        setRoles([]);
      } finally {
        setIsLoadingRoles(false);
      }
    }

    void loadRoles();
  }, []);

  async function onSubmit(values: CreateUserFormValues): Promise<void> {
    try {
      /*
       * Limpiamos IDs opcionales.
       * Si roleId es NONE, enviamos undefined para no romper validaciones del backend.
       */
      await usersService.create({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phone: values.phone || undefined,
        roleId: normalizeOptionalId(values.roleId),
        branchId: normalizeOptionalId(values.branchId),
      });

      toast.success("Usuario creado correctamente");

      router.push("/dashboard/users");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Datos del usuario</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Carlos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Ramírez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="usuario@taller.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="999999999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mínimo 6 caracteres"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      disabled={isLoadingRoles}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin rol</SelectItem>

                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/*
             * Campo opcional.
             * Lo dejamos como texto por ahora para evitar depender de un endpoint de sucursales.
             * Luego podemos reemplazarlo por un Select de branches.
             */}
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de sucursal opcional</FormLabel>
                  <FormControl>
                    <Input placeholder="Puedes dejarlo vacío" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/users")}
              >
                Cancelar
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar usuario
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
