"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Loader2, Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  diagnosticSchema,
  toOptionalConfidence,
  type DiagnosticFormValues,
} from "@/schemas/diagnostic.schema";
import { diagnosticsService } from "@/services/diagnostics.service";
import { workOrdersService } from "@/services/work-orders.service";
import type { WorkOrder } from "@/types/work-order";
import type { CreateDiagnosticPayload } from "@/types/diagnostic";

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

interface DiagnosticFormProps {
  /*
   * Si llega workOrderId, el formulario se usa dentro del detalle de una orden.
   * Si no llega, mostramos selector de orden.
   */
  workOrderId?: string;
  onCreated?: () => Promise<void> | void;
}

/*
 * Tipo de entrada del formulario.
 * Ayuda cuando Zod normaliza o transforma valores.
 */
type DiagnosticFormInput = z.input<typeof diagnosticSchema>;

export function DiagnosticForm({
  workOrderId,
  onCreated,
}: DiagnosticFormProps) {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  const form = useForm<DiagnosticFormInput, unknown, DiagnosticFormValues>({
    resolver: zodResolver(diagnosticSchema) as any,
    defaultValues: {
      type: "TECHNICAL",
      title: "",
      description: "",
      aiSuggestion: "",
      confidence: "",
      solution: "",
      notes: "",
      workOrderId: workOrderId ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  /*
   * Observamos el tipo seleccionado sin usar form.watch directamente.
   * Así evitamos advertencias de hooks o renderizados innecesarios.
   */
  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  /*
   * Solo cargamos órdenes si el formulario no recibió workOrderId.
   * Esto evita llamadas innecesarias cuando estamos en detalle de orden.
   */
  useEffect(() => {
    if (workOrderId) {
      return;
    }

    async function loadOrders(): Promise<void> {
      try {
        setIsLoadingOrders(true);

        const response = await workOrdersService.findAll({
          page: 1,
          limit: 100,
        });

        setOrders(response.data);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingOrders(false);
      }
    }

    void loadOrders();
  }, [workOrderId]);

  async function onSubmit(values: DiagnosticFormValues): Promise<void> {
    try {
      const payload: CreateDiagnosticPayload = {
        type: values.type,
        title: values.title.trim(),
        description: values.description.trim(),
        aiSuggestion: values.aiSuggestion || undefined,
        confidence: toOptionalConfidence(values.confidence),
        solution: values.solution || undefined,
        notes: values.notes || undefined,
        workOrderId: workOrderId ?? values.workOrderId,
      };

      await diagnosticsService.create(payload);

      toast.success("Diagnóstico registrado correctamente");

      form.reset({
        type: "TECHNICAL",
        title: "",
        description: "",
        aiSuggestion: "",
        confidence: "",
        solution: "",
        notes: "",
        workOrderId: workOrderId ?? "",
      });

      await onCreated?.();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Registrar diagnóstico
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            {!workOrderId ? (
              <FormField
                control={form.control}
                name="workOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de trabajo</FormLabel>
                    <Select
                      disabled={isLoadingOrders}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingOrders
                                ? "Cargando órdenes..."
                                : "Selecciona una orden"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {orders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.code} · {order.vehicle?.plate ?? "Sin placa"}{" "}
                            · {order.reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

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
                          <SelectValue placeholder="Tipo de diagnóstico" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="INITIAL">Inicial</SelectItem>
                        <SelectItem value="TECHNICAL">Técnico</SelectItem>
                        <SelectItem value="FINAL">Final</SelectItem>
                        <SelectItem value="AI_SUGGESTED">
                          Sugerido por IA
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confianza %</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        max={100}
                        placeholder="Ej. 95"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Desgaste crítico en sistema de frenos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción técnica</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el hallazgo técnico..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === "AI_SUGGESTED" ? (
              <FormField
                control={form.control}
                name="aiSuggestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sugerencia IA</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Campo reservado para análisis o recomendación de IA..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solución propuesta o realizada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej. Cambiar pastillas delanteras y rectificar disco..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas internas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales..."
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
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar diagnóstico
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
