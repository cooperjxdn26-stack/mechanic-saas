import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
}

/*
 * Encabezado compacto reutilizable.
 * Sirve para dar identidad visual sin ocupar demasiado espacio.
 */
export function PageHeader({
  title,
  description,
  badge,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

              {badge ? (
                <Badge
                  variant="outline"
                  className="border-orange-200 bg-orange-50 text-orange-700"
                >
                  {badge}
                </Badge>
              ) : null}
            </div>

            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
