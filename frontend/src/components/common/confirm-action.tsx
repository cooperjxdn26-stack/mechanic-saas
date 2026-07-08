"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ConfirmActionProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
}

/*
 * Confirmación simple y reutilizable.
 * Por ahora usa window.confirm para no meter más dependencias.
 * Luego podemos reemplazarlo por AlertDialog de shadcn.
 */
export function ConfirmAction({
  title,
  description,
  confirmLabel = "Confirmar",
  variant = "destructive",
  onConfirm,
}: ConfirmActionProps) {
  async function handleClick(): Promise<void> {
    const confirmed = window.confirm(`${title}\n\n${description}`);

    if (!confirmed) {
      return;
    }

    await onConfirm();
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      <AlertTriangle className="mr-2 h-4 w-4" />
      {confirmLabel}
    </Button>
  );
}
