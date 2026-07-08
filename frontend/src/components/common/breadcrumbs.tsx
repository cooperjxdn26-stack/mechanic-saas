"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/*
 * Breadcrumb reutilizable.
 * Útil en pantallas de detalle, edición y creación.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
        Dashboard
      </Link>

      {items.map((item) => (
        <div
          key={`${item.label}-${item.href ?? "current"}`}
          className="flex items-center gap-1"
        >
          <ChevronRight className="h-3.5 w-3.5" />

          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
