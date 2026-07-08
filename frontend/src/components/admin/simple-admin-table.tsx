import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleAdminTableProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/*
 * Contenedor simple para tablas administrativas.
 * Lo usamos en usuarios, roles, auditoría y notificaciones.
 */
export function SimpleAdminTable({
  title,
  description,
  children,
}: SimpleAdminTableProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
