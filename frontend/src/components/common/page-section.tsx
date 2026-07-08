import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/*
 * Contenedor estándar para secciones internas.
 * Útil para tablas, formularios, resúmenes y listados.
 */
export function PageSection({
  title,
  description,
  children,
  action,
}: PageSectionProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>

          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {action ? <div>{action}</div> : null}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
