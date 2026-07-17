/*
 * Roles oficiales del sistema.
 * Deben coincidir con los nombres que vienen desde el backend.
 */
export type AppRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "RECEPTIONIST"
  | "MECHANIC"
  | "CASHIER"
  | "CUSTOMER";

/*
 * Permisos internos del frontend.
 * Cada permiso representa una acción o módulo visible.
 */
export type AppPermission =
  | "dashboard.view"
  | "customers.view"
  | "vehicles.view"
  | "workOrders.view"
  | "workOrders.create"
  | "workOrders.update"
  | "workOrders.changeStatus"
  | "workOrders.kanban"
  | "workOrders.checklist"
  | "diagnostics.view"
  | "services.view"
  | "parts.view"
  | "suppliers.view"
  | "purchases.view"
  | "quotes.view"
  | "invoices.view"
  | "payments.view"
  | "cashRegisters.view"
  | "reports.view"
  | "users.view"
  | "users.create"
  | "users.update"
  | "roles.view"
  | "auditLogs.view"
  | "kanban.view"
  | "parts.lowStock"
  | "notifications.view"
  | "settings.view"
  | "customers.create"
  | "vehicles.create"
  | "vehicles.delete"
  | "quotes.create"
  | "payments.create"
  | "cashRegisters.open"
  | "continuity.view"
  | "continuity.create"
  | "continuity.restore"
  | "continuity.delete";

const ROLE_PERMISSIONS: Record<string, AppPermission[]> = {
  SUPER_ADMIN: [
    "dashboard.view",
    "customers.view",
    "vehicles.view",
    "workOrders.view",
    "workOrders.create",
    "workOrders.update",
    "workOrders.changeStatus",
    "workOrders.kanban",
    "workOrders.checklist",
    "diagnostics.view",
    "services.view",
    "parts.view",
    "suppliers.view",
    "purchases.view",
    "quotes.view",
    "invoices.view",
    "payments.view",
    "cashRegisters.view",
    "reports.view",
    "users.view",
    "users.create",
    "users.update",
    "roles.view",
    "auditLogs.view",
    "kanban.view",
    "parts.lowStock",
    "notifications.view",
    "settings.view",
    "customers.create",
    "vehicles.create",
    "vehicles.delete",
    "quotes.create",
    "payments.create",
    "cashRegisters.open",
    "continuity.view",
    "continuity.create",
    "continuity.restore",
    "continuity.delete",
  ],

  ADMIN: [
    "dashboard.view",
    "customers.view",
    "vehicles.view",
    "workOrders.view",
    "workOrders.create",
    "workOrders.update",
    "workOrders.changeStatus",
    "workOrders.kanban",
    "workOrders.checklist",
    "diagnostics.view",
    "services.view",
    "parts.view",
    "suppliers.view",
    "purchases.view",
    "quotes.view",
    "invoices.view",
    "payments.view",
    "cashRegisters.view",
    "reports.view",
    "users.view",
    "kanban.view",
    "parts.lowStock",
    "notifications.view",
    "settings.view",
    "customers.create",
    "vehicles.create",
    "vehicles.delete",
    "quotes.create",
    "payments.create",
    "cashRegisters.open",
    "continuity.view",
    "continuity.create",
    "continuity.restore",
    "continuity.delete",
  ],

  RECEPTIONIST: [
    "dashboard.view",
    "customers.view",
    "vehicles.view",
    "workOrders.view",
    "workOrders.create",
    "workOrders.update",
    "workOrders.changeStatus",
    "workOrders.kanban",
    "diagnostics.view",
    "quotes.view",
    "kanban.view",
    "customers.create",
    "vehicles.create",
    "quotes.create",
  ],

  MECHANIC: [
    "dashboard.view",
    "workOrders.view",
    "workOrders.changeStatus",
    "workOrders.kanban",
    "workOrders.checklist",
    "diagnostics.view",
    "kanban.view",
  ],

  CASHIER: [
    "dashboard.view",
    "workOrders.view",
    "invoices.view",
    "payments.view",
    "cashRegisters.view",
    "reports.view",
    "notifications.view",
    "payments.create",
    "cashRegisters.open",
  ],

  CUSTOMER: [],
};

function normalizeRole(role?: string | null): string | null {
  if (!role) {
    return null;
  }

  return role.trim().toUpperCase().replace(/\s+/g, "_");
}

export function hasPermission(
  role: string | null | undefined,
  permission: AppPermission,
): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return false;
  }

  /*
   * SUPER_ADMIN siempre tiene acceso total.
   */
  if (normalizedRole === "SUPER_ADMIN") {
    return true;
  }

  return ROLE_PERMISSIONS[normalizedRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: string | null | undefined,
  permissions: AppPermission[],
): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return false;
  }

  if (normalizedRole === "SUPER_ADMIN") {
    return true;
  }

  return permissions.some((permission) =>
    ROLE_PERMISSIONS[normalizedRole]?.includes(permission),
  );
}
