import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuoteForm } from "@/components/quotes/quote-form";

export default function NewQuotePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/quotes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nueva cotización
          </h1>
          <p className="mt-1 text-muted-foreground">
            Agrega servicios, repuestos, mano de obra y extras.
          </p>
        </div>
      </div>

      <QuoteForm mode="create" />
    </div>
  );
}
