"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import {
  openCashRegisterSchema,
  type OpenCashRegisterFormValues,
} from "@/schemas/cash-register.schema";
import { cashRegistersService } from "@/services/cash-registers.service";
import type { CashRegister } from "@/types/cash-register";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CashRegisterCard } from "@/components/finance/cash-register-card";

export default function CashRegistersPage() {
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OpenCashRegisterFormValues>({
    resolver: zodResolver(openCashRegisterSchema) as any,
    defaultValues: {
      openingAmount: 0,
      notes: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function loadCashRegisters(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await cashRegistersService.findAll();
      setCashRegisters(response);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCashRegisters();
  }, []);

  async function openCash(values: OpenCashRegisterFormValues): Promise<void> {
    try {
      /*
       * El backend valida que no exista otra caja abierta.
       */
      await cashRegistersService.open({
        openingAmount: values.openingAmount,
        notes: values.notes || undefined,
      });

      toast.success("Caja abierta correctamente");
      form.reset({ openingAmount: 0, notes: "" });
      await loadCashRegisters();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Caja</h1>
        <p className="mt-1 text-muted-foreground">
          Abre, controla y cierra cajas diarias del taller.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Abrir caja</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="grid gap-4 md:grid-cols-[220px_1fr_auto]"
              onSubmit={form.handleSubmit(openCash)}
            >
              <FormField
                control={form.control}
                name="openingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto inicial</FormLabel>
                    <FormControl>
                      <Input min={0} step="0.01" type="number" {...field} />
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
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Apertura de caja del día..."
                        rows={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Abriendo...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Abrir caja
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cashRegisters.map((cashRegister) => (
            <CashRegisterCard
              key={cashRegister.id}
              cashRegister={cashRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}
