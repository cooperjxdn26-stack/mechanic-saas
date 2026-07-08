"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  checklistSchema,
  type ChecklistFormValues,
} from "@/schemas/work-order.schema";
import { workOrdersService } from "@/services/work-orders.service";

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

interface ChecklistFormProps {
  workOrderId: string;
  onCreated?: () => Promise<void> | void;
}

export function ChecklistForm({ workOrderId, onCreated }: ChecklistFormProps) {
  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema) as any,
    defaultValues: {
      item: "",
      status: "PENDING",
      notes: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ChecklistFormValues): Promise<void> {
    try {
      /*
       * Cada item queda vinculado a la orden.
       * El backend lo muestra luego en timeline y detalle.
       */
      await workOrdersService.addChecklistItem(workOrderId, {
        item: values.item,
        status: values.status,
        notes: values.notes || undefined,
      });

      toast.success("Checklist agregado");
      form.reset({
        item: "",
        status: "PENDING",
        notes: "",
      });

      await onCreated?.();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Agregar checklist</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item de revisión</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Revisión de frenos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="PASSED">Correcto</SelectItem>
                      <SelectItem value="FAILED">Falló</SelectItem>
                      <SelectItem value="WARNING">Advertencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observación técnica..."
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
                  Agregando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
