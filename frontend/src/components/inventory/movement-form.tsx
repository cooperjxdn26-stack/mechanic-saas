"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { movementSchema, type MovementFormValues } from "@/schemas/part.schema";
import { partsService } from "@/services/parts.service";

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
import { Textarea } from "@/components/ui/textarea";

interface MovementFormProps {
  partId: string;
  onCreated?: () => Promise<void> | void;
}

export function MovementForm({ partId, onCreated }: MovementFormProps) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema) as any,
    defaultValues: {
      type: "IN",
      quantity: 1,
      reason: "",
      reference: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: MovementFormValues): Promise<void> {
    try {
      /*
       * Este endpoint modifica stock y registra Kardex.
       * Por eso no editamos stock directo desde el formulario de repuesto.
       */
      await partsService.createMovement(partId, {
        type: values.type,
        quantity: values.quantity,
        reason: values.reason || undefined,
        reference: values.reference || undefined,
      });

      toast.success("Movimiento registrado correctamente");

      form.reset({
        type: "IN",
        quantity: 1,
        reason: "",
        reference: "",
      });

      await onCreated?.();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Movimiento de inventario</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de movimiento" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="IN">Entrada</SelectItem>
                        <SelectItem value="OUT">Salida</SelectItem>
                        <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                        <SelectItem value="RETURN">Devolución</SelectItem>
                        <SelectItem value="LOSS">Pérdida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input min={1} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="OT-2026-000001, AJUSTE-001..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Motivo del movimiento..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar movimiento
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
