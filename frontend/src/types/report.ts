export interface ReportMetric {
  label: string;
  value: string | number;
  description?: string;
}

/*
 * =========================
 * REPORTE DE VENTAS
 * =========================
 */

export interface SalesReportRow {
  code: string;
  date: string | Date | null;
  customer: string | null;
  invoice: string | null;
  method: string;
  amount: number;
  cashier: string | null;
}

export interface SalesReport {
  title: string;
  filters: unknown;
  summary: {
    total: number;
    count: number;
    byMethod: Record<string, number>;
  };
  rows: SalesReportRow[];
}

/*
 * =========================
 * REPORTE DE INVENTARIO
 * =========================
 */

export interface InventoryReportRow {
  name: string;
  sku: string | null;
  code: string | null;
  category: string | null;
  brand: string | null;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  stockValue: number;
  supplier: string | null;
  lowStock: boolean;
}

export interface InventoryReport {
  title: string;
  filters: unknown;
  summary: {
    totalParts: number;
    lowStockCount: number;
    totalStockValue: number;
  };
  rows: InventoryReportRow[];
}

/*
 * =========================
 * REPORTE DE ÓRDENES
 * =========================
 */

export interface WorkOrdersReportRow {
  code: string;
  status: string;
  priority: string;
  reason: string;
  customer: string;
  plate: string;
  vehicle: string;
  mechanic: string | null;
  receivedAt: string | Date | null;
  estimatedDelivery: string | Date | null;
}

export interface WorkOrdersReport {
  title: string;
  filters: unknown;
  summary: {
    total: number;
    byStatus: Record<string, number>;
  };
  rows: WorkOrdersReportRow[];
}

/*
 * =========================
 * REPORTE FINANCIERO
 * =========================
 */

export interface FinancialReport {
  title: string;
  filters: unknown;
  summary: {
    paidTotal: number;
    invoicedTotal: number;
    quotedTotal: number;
    pendingCollection: number;
    paymentsCount: number;
    invoicesCount: number;
    quotesCount: number;
  };
}

/*
 * =========================
 * REPORTE DE MECÁNICOS
 * =========================
 */

export interface MechanicsReport {
  mechanic: string;
  email: string;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
}

export interface MechanicsReportResponse {
  title: string;
  filters: unknown;
  rows: MechanicsReport[];
}
