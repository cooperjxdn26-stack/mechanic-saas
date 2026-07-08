"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { getApiErrorMessage } from "@/lib/api";
import {
  normalizeOptionalId,
  paymentSchema,
  type PaymentFormValues,
} from "@/schemas/payment.schema";
import { cashRegistersService } from "@/services/cash-registers.service";
import { customersService } from "@/services/customers.service";
import { invoicesService } from "@/services/invoices.service";
import { paymentsService } from "@/services/payments.service";
import type { CashRegister } from "@/types/cash-register";
import type { Customer } from "@/types/customer";
import type { Invoice } from "@/types/invoice";

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

/*
 * Tipo de entrada del formulario.
 * Ayuda a evitar conflictos entre zodResolver, useForm y FormField.
 */
type PaymentFormInput = z.input<typeof paymentSchema>;

export function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const invoiceIdFromUrl = searchParams.get("invoiceId");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openCashRegister, setOpenCashRegister] = useState<CashRegister | null>(
    null,
  );

  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(true);
  const [cashRegisterWasChecked, setCashRegisterWasChecked] =
    useState<boolean>(false);

  const form = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      method: "CASH",
      status: "PAID",
      amount: 0,
      reference: "",
      notes: "",
      customerId: "NONE",
      invoiceId: invoiceIdFromUrl ?? "NONE",
      cashRegisterId: "NONE",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    async function loadCatalogs(): Promise<void> {
      try {
        setIsLoadingCatalogs(true);

        const [customersResponse, invoicesResponse] = await Promise.all([
          customersService.findAll({ page: 1, limit: 100 }),
          invoicesService.findAll({ page: 1, limit: 100 }),
        ]);

        setCustomers(customersResponse.data);
        setInvoices(invoicesResponse.data);

        /*
         * Si venimos desde una factura, seleccionamos la factura
         * y calculamos automáticamente el saldo pendiente.
         */
        if (invoiceIdFromUrl) {
          const invoice = invoicesResponse.data.find(
            (item) => item.id === invoiceIdFromUrl,
          );

          if (invoice) {
            form.setValue("invoiceId", invoice.id);

            if (invoice.customerId) {
              form.setValue("customerId", invoice.customerId);
            }

            const paid =
              invoice.payments?.reduce((acc, payment) => {
                return acc + Number(payment.amount);
              }, 0) ?? 0;

            const remaining = Number(invoice.total) - paid;

            if (remaining > 0) {
              form.setValue("amount", Number(remaining.toFixed(2)));
            }
          }
        }

        /*
         * Consultamos caja abierta.
         * Si existe, la preseleccionamos para que el pago ingrese a caja.
         */
        try {
          const cash = await cashRegistersService.getOpen();

          setOpenCashRegister(cash);
          form.setValue("cashRegisterId", cash.id);
        } catch (cashError: unknown) {
          console.warn("No se encontró caja abierta:", cashError);

          setOpenCashRegister(null);
          form.setValue("cashRegisterId", "NONE");
        } finally {
          setCashRegisterWasChecked(true);
        }
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingCatalogs(false);
      }
    }

    void loadCatalogs();
  }, [form, invoiceIdFromUrl]);

  async function onSubmit(values: PaymentFormValues): Promise<void> {
    try {
      await paymentsService.create({
        method: values.method,
        status: values.status,
        amount: values.amount,
        reference: values.reference || undefined,
        notes: values.notes || undefined,
        customerId: normalizeOptionalId(values.customerId),
        invoiceId: normalizeOptionalId(values.invoiceId),

        /*
         * Si hay una caja abierta detectada, usamos esa caja.
         * Si no, respetamos el valor seleccionado en el formulario.
         */
        cashRegisterId: normalizeOptionalId(
          openCashRegister?.id ?? values.cashRegisterId,
        ),
      });

      toast.success("Pago registrado correctamente");

      router.push("/dashboard/payments");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Registrar pago</CardTitle>
      </CardHeader>

      <CardContent>
        {cashRegisterWasChecked && !openCashRegister ? (
          <div className="mb-5 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              No hay caja abierta. Puedes registrar el pago sin caja, pero lo
              recomendable es abrir caja primero.
            </p>
          </div>
        ) : null}

        {openCashRegister ? (
          <div className="mb-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            Caja abierta detectada:{" "}
            <span className="font-semibold">{openCashRegister.code}</span>. El
            pago será asociado automáticamente a esta caja.
          </div>
        ) : null}

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Método" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="CASH">Efectivo</SelectItem>
                        <SelectItem value="CARD">Tarjeta</SelectItem>
                        <SelectItem value="TRANSFER">Transferencia</SelectItem>
                        <SelectItem value="YAPE">Yape</SelectItem>
                        <SelectItem value="PLIN">Plin</SelectItem>
                        <SelectItem value="POS">POS</SelectItem>
                        <SelectItem value="CREDIT">Crédito</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  /*
                   * React Hook Form puede entregar field.value con un tipo amplio.
                   * Lo normalizamos para que el Input reciba siempre number o string.
                   */
                  const amountValue =
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : 0;

                  return (
                    <FormItem>
                      <FormLabel>Monto</FormLabel>
                      <FormControl>
                        <Input
                          min={0.01}
                          step="0.01"
                          type="number"
                          value={amountValue}
                          onChange={(event) => {
                            const value = event.target.value;

                            /*
                             * Los inputs type="number" devuelven string.
                             * Convertimos a number para mantener el schema correcto.
                             */
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia</FormLabel>
                    <FormControl>
                      <Input placeholder="Operación, voucher..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Cliente opcional" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin cliente</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factura</FormLabel>
                    <Select
                      disabled={isLoadingCatalogs}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);

                        /*
                         * Al seleccionar una factura manualmente,
                         * también seleccionamos cliente y saldo pendiente.
                         */
                        const invoice = invoices.find(
                          (item) => item.id === value,
                        );

                        if (!invoice) {
                          return;
                        }

                        if (invoice.customerId) {
                          form.setValue("customerId", invoice.customerId);
                        }

                        const paid =
                          invoice.payments?.reduce((acc, payment) => {
                            return acc + Number(payment.amount);
                          }, 0) ?? 0;

                        const remaining = Number(invoice.total) - paid;

                        if (remaining > 0) {
                          form.setValue("amount", Number(remaining.toFixed(2)));
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Factura opcional" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NONE">Sin factura</SelectItem>
                        {invoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.code} ·{" "}
                            {invoice.customer?.name ?? "Cliente"} · S/{" "}
                            {invoice.total}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cashRegisterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caja</FormLabel>
                  <Select
                    disabled={isLoadingCatalogs}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Caja opcional" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="NONE">Sin caja</SelectItem>

                      {openCashRegister ? (
                        <SelectItem value={openCashRegister.id}>
                          {openCashRegister.code} · Caja abierta
                        </SelectItem>
                      ) : null}
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
                      placeholder="Observaciones del pago..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/payments")}
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
                    Registrar pago
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
