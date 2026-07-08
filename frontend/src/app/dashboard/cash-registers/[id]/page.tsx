"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  closeCashRegisterSchema,
  type CloseCashRegisterFormValues,
} from "@/schemas/cash-register.schema";
import { cashRegistersService } from "@/services/cash-registers.service";
import type {
  CashRegister,
  CashRegisterSummary as CashRegisterSummaryType,
} from "@/types/cash-register";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { CashRegisterSummary } from "@/components/finance/cash-register-summary";
import { PaymentTable } from "@/components/finance/payment-table";

export default function CashRegisterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [summary, setSummary] = useState<CashRegisterSummaryType | null>(null);
  const [paymentSearch, setPaymentSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CloseCashRegisterFormValues>({
    resolver: zodResolver(closeCashRegisterSchema),
    defaultValues: {
      closingAmount: 0,
      notes: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function loadCashRegister(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const [cashResponse, summaryResponse] = await Promise.all([
        cashRegistersService.findOne(id),
        cashRegistersService.summary(id),
      ]);

      setCashRegister(cashResponse);
      setSummary(summaryResponse);
      form.setValue("closingAmount", summaryResponse.expectedAmount);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCashRegister();
  }, [id]);

  async function closeCash(values: CloseCashRegisterFormValues): Promise<void> {
    try {
      /*
       * El backend calcula expectedAmount y difference.
       * El frontend solo envía el monto físico contado.
       */
      await cashRegistersService.close(id, {
        closingAmount: values.closingAmount,
        notes: values.notes || undefined,
      });

      toast.success("Caja cerrada correctamente");
      await loadCashRegister();
    } catch (requestError: unknown) {
      toast.error(getApiErrorMessage(requestError));
    }
  }

  const filteredPayments =
    cashRegister?.payments?.filter((payment) => {
      const term = paymentSearch.toLowerCase();

      return (
        payment.code.toLowerCase().includes(term) ||
        (payment.reference ?? "").toLowerCase().includes(term) ||
        (payment.customer?.name ?? "").toLowerCase().includes(term)
      );
    }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/cash-registers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalle de caja</h1>
          <p className="mt-1 text-muted-foreground">
            Pagos, resumen y cierre de caja.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && cashRegister && summary ? (
        <>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-3 text-2xl">
                {cashRegister.code}
                <Badge>
                  {cashRegister.status === "OPEN" ? "Abierta" : "Cerrada"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Abierta el {formatDateTime(cashRegister.openedAt)}
              </p>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-3">
              <Info
                label="Monto inicial"
                value={formatCurrency(Number(cashRegister.openingAmount))}
              />
              <Info
                label="Monto esperado"
                value={formatCurrency(summary.expectedAmount)}
              />
              <Info
                label="Diferencia"
                value={
                  summary.difference === null
                    ? "Pendiente"
                    : formatCurrency(summary.difference)
                }
              />
            </CardContent>
          </Card>

          <CashRegisterSummary summary={summary} />

          {cashRegister.status === "OPEN" ? (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Cerrar caja</CardTitle>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    className="grid gap-4 md:grid-cols-[220px_1fr_auto]"
                    onSubmit={form.handleSubmit(closeCash)}
                  >
                    <FormField
                      control={form.control}
                      name="closingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto contado</FormLabel>
                          <FormControl>
                            <Input
                              min={0}
                              step="0.01"
                              type="number"
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
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Notas de cierre..."
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
                            Cerrando...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Cerrar caja
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : null}

          <PaymentTable
            payments={filteredPayments}
            search={paymentSearch}
            isLoading={false}
            onSearchChange={setPaymentSearch}
          />
        </>
      ) : null}
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
