"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { partsService } from "@/services/parts.service";
import type { Part } from "@/types/inventory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PartForm } from "@/components/inventory/part-form";

export default function EditPartPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [part, setPart] = useState<Part | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPart(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await partsService.findOne(id);
        setPart(response);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadPart();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/parts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar repuesto</h1>
          <p className="mt-1 text-muted-foreground">
            Actualiza datos comerciales del repuesto.
          </p>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? <Skeleton className="h-96 rounded-2xl" /> : null}

      {!isLoading && part ? <PartForm part={part} mode="edit" /> : null}
    </div>
  );
}
