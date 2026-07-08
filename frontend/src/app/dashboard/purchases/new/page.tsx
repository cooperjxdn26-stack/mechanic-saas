import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PurchaseForm } from "@/components/purchases/purchase-form";

export default function NewPurchasePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/purchases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva compra</h1>
          <p className="mt-1 text-muted-foreground">
            Registra compra de repuestos. Si la marcas como recibida, ingresará
            stock.
          </p>
        </div>
      </div>

      <PurchaseForm />
    </div>
  );
}
