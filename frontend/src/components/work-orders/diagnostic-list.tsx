"use client";

import { Brain, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { diagnosticsService } from "@/services/diagnostics.service";
import type { Diagnostic, DiagnosticType } from "@/types/diagnostic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiagnosticListProps {
  diagnostics: Diagnostic[];
  onDeleted?: () => Promise<void> | void;
  allowDelete?: boolean;
}

const typeLabels: Record<DiagnosticType, string> = {
  INITIAL: "Inicial",
  TECHNICAL: "Técnico",
  FINAL: "Final",
  AI_SUGGESTED: "IA",
};

export function DiagnosticList({
  diagnostics,
  onDeleted,
  allowDelete = false,
}: DiagnosticListProps) {
  async function handleDelete(diagnostic: Diagnostic): Promise<void> {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar el diagnóstico "${diagnostic.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await diagnosticsService.remove(diagnostic.id);
      toast.success("Diagnóstico eliminado");
      await onDeleted?.();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Diagnósticos registrados
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {diagnostics.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Todavía no hay diagnósticos registrados.
          </div>
        ) : (
          diagnostics.map((diagnostic) => (
            <div key={diagnostic.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="h-fit rounded-xl bg-primary/10 p-2 text-primary">
                    {diagnostic.type === "AI_SUGGESTED" ? (
                      <Brain className="h-5 w-5" />
                    ) : (
                      <Stethoscope className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{diagnostic.title}</p>
                      <Badge variant="outline">
                        {typeLabels[diagnostic.type]}
                      </Badge>

                      {typeof diagnostic.confidence === "number" ? (
                        <Badge variant="secondary">
                          {diagnostic.confidence}% confianza
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {diagnostic.description}
                    </p>

                    {diagnostic.aiSuggestion ? (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-medium">Sugerencia IA</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {diagnostic.aiSuggestion}
                        </p>
                      </div>
                    ) : null}

                    {diagnostic.solution ? (
                      <div className="mt-3 rounded-lg border p-3">
                        <p className="text-xs font-medium">Solución</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {diagnostic.solution}
                        </p>
                      </div>
                    ) : null}

                    {diagnostic.notes ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium">Notas:</span>{" "}
                        {diagnostic.notes}
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs text-muted-foreground">
                      Registrado: {formatDateTime(diagnostic.createdAt)}
                    </p>
                  </div>
                </div>

                {allowDelete ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(diagnostic)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
