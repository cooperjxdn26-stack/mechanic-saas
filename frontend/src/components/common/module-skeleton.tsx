import { Skeleton } from "@/components/ui/skeleton";

interface ModuleSkeletonProps {
  cards?: number;
  rows?: number;
}

/*
 * Skeleton reutilizable para páginas de módulos.
 * Da consistencia mientras carga la información.
 */
export function ModuleSkeleton({ cards = 3, rows = 5 }: ModuleSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-12 rounded-2xl" />

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
