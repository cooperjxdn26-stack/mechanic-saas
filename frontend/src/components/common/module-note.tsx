import type { LucideIcon } from "lucide-react";

interface ModuleNoteProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "info" | "warning" | "success" | "dark";
}

/*
 * Nota compacta para explicar reglas del módulo.
 * Ejemplo: stock protegido, caja cerrada, historial seguro, etc.
 */
export function ModuleNote({
  title,
  description,
  icon: Icon,
  variant = "info",
}: ModuleNoteProps) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-950",
    warning: "border-amber-200 bg-amber-50 text-amber-950",
    success: "border-emerald-200 bg-emerald-50 text-emerald-950",
    dark: "border-zinc-200 bg-zinc-50 text-zinc-950",
  };

  const iconStyles = {
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    success: "bg-emerald-100 text-emerald-600",
    dark: "bg-zinc-100 text-zinc-700",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconStyles[variant]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm opacity-80">{description}</p>
        </div>
      </div>
    </div>
  );
}
