/*
 * Centralizamos todas las rutas del frontend.
 * Así evitamos escribir rutas manualmente en varios archivos.
 */
export const routes = {
  home: "/",
  login: "/login",

  dashboard: "/dashboard",

  customers: "/dashboard/customers",
  vehicles: "/dashboard/vehicles",

  workOrders: "/dashboard/work-orders",
  workOrdersKanban: "/dashboard/work-orders/kanban",

  diagnostics: "/dashboard/diagnostics",

  services: "/dashboard/services",

  parts: "/dashboard/parts",
  partsLowStock: "/dashboard/parts/low-stock",

  suppliers: "/dashboard/suppliers",
  purchases: "/dashboard/purchases",

  quotes: "/dashboard/quotes",
  invoices: "/dashboard/invoices",
  payments: "/dashboard/payments",
  cashRegisters: "/dashboard/cash-registers",

  reports: "/dashboard/reports",
  reportsSales: "/dashboard/reports/sales",
  reportsInventory: "/dashboard/reports/inventory",
  reportsWorkOrders: "/dashboard/reports/work-orders",
  reportsFinancial: "/dashboard/reports/financial",
  reportsMechanics: "/dashboard/reports/mechanics",

  notifications: "/dashboard/notifications",
  auditLogs: "/dashboard/audit-logs",

  users: "/dashboard/users",
  roles: "/dashboard/roles",
  complaintBook: "/dashboard/complaint-book",

  publicQuote: "/public/quotes",
} as const;
