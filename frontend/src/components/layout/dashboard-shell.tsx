"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";

import { AppSidebar } from "./app-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  /*
   * Protección simple del lado cliente.
   * Más adelante podemos reforzar con middleware.
   */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(routes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
