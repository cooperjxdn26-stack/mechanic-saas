import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentForm } from "@/components/finance/payment-form";

export default function NewPaymentPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo pago</h1>
          <p className="mt-1 text-muted-foreground">
            Registra pagos parciales o completos vinculados a facturas y caja.
          </p>
        </div>
      </div>

      <PaymentForm />
    </div>
  );
}
