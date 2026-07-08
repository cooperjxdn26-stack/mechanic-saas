"use client";

import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { CashRegister } from "@/types/cash-register";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CashRegisterCardProps {
  cashRegister: CashRegister;
}

export function CashRegisterCard({ cashRegister }: CashRegisterCardProps) {
  const paymentsTotal =
    cashRegister.payments?.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0) ?? 0;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          {cashRegister.code}
          <Badge>
            {cashRegister.status === "OPEN" ? "Abierta" : "Cerrada"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Info
          label="Apertura"
          value={formatCurrency(Number(cashRegister.openingAmount))}
        />
        <Info label="Pagos" value={formatCurrency(paymentsTotal)} />
        <Info label="Fecha" value={formatDateTime(cashRegister.openedAt)} />

        <Button asChild className="w-full" variant="outline">
          <Link href={`/dashboard/cash-registers/${cashRegister.id}`}>
            Ver caja
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
