import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  Car,
  ClipboardList,
  FileBarChart,
  FileText,
  Home,
  Landmark,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Users,
  UserCog,
  Wallet,
  Wrench,
} from "lucide-react";

import { routes } from "./routes";
import type { AppPermission } from "./permissions";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;

  /*
   * Permiso necesario para mostrar este módulo en el sidebar.
   */
  permission: AppPermission;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

/*
 * Menú lateral basado en permisos.
 * Si el usuario no tiene el permiso, el módulo se oculta.
 */
export const navigationGroups: NavigationGroup[] = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        href: routes.dashboard,
        icon: Home,
        permission: "dashboard.view",
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        title: "Clientes",
        href: routes.customers,
        icon: Users,
        permission: "customers.view",
      },
      {
        title: "Vehículos",
        href: routes.vehicles,
        icon: Car,
        permission: "vehicles.view",
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        title: "Órdenes",
        href: routes.workOrders,
        icon: ClipboardList,
        permission: "workOrders.view",
      },
      {
        title: "Kanban",
        href: routes.workOrdersKanban,
        icon: BarChart3,
        permission: "kanban.view",
      },
      {
        title: "Diagnósticos",
        href: routes.diagnostics,
        icon: Stethoscope,
        permission: "diagnostics.view",
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      {
        title: "Servicios",
        href: routes.services,
        icon: Wrench,
        permission: "services.view",
      },
      {
        title: "Repuestos",
        href: routes.parts,
        icon: Package,
        permission: "parts.view",
      },
      {
        title: "Stock bajo",
        href: routes.partsLowStock,
        icon: Activity,
        permission: "parts.lowStock",
      },
      {
        title: "Proveedores",
        href: routes.suppliers,
        icon: Boxes,
        permission: "suppliers.view",
      },
      {
        title: "Compras",
        href: routes.purchases,
        icon: ShoppingCart,
        permission: "purchases.view",
      },
    ],
  },
  {
    title: "Finanzas",
    items: [
      {
        title: "Cotizaciones",
        href: routes.quotes,
        icon: FileText,
        permission: "quotes.view",
      },
      {
        title: "Facturas",
        href: routes.invoices,
        icon: Receipt,
        permission: "invoices.view",
      },
      {
        title: "Pagos",
        href: routes.payments,
        icon: Landmark,
        permission: "payments.view",
      },
      {
        title: "Caja",
        href: routes.cashRegisters,
        icon: Wallet,
        permission: "cashRegisters.view",
      },
    ],
  },
  {
    title: "Reportes",
    items: [
      {
        title: "Reportes",
        href: routes.reports,
        icon: FileBarChart,
        permission: "reports.view",
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        title: "Notificaciones",
        href: routes.notifications,
        icon: Bell,
        permission: "notifications.view",
      },
      {
        title: "Auditoría",
        href: routes.auditLogs,
        icon: ShieldCheck,
        permission: "auditLogs.view",
      },
      {
        title: "Usuarios",
        href: routes.users,
        icon: UserCog,
        permission: "users.view",
      },
      {
        title: "Roles",
        href: routes.roles,
        icon: ShieldCheck,
        permission: "roles.view",
      },
      {
        title: "Libro de Reclamaciones",
        href: routes.complaintBook,
        icon: ClipboardList,
        permission: "settings.view",
      },
    ],
  },
];

export const navigationItems: NavigationItem[] = navigationGroups.flatMap(
  (group) => group.items,
);
