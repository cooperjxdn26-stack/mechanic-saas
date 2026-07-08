export interface DashboardOverview {
  totalCustomers: number;
  totalVehicles: number;
  activeOrders: number;
  overdueOrders: number;
  completedOrders: number;
  lowStockParts: number;
  pendingQuotes: number;
  monthlyRevenue: number;
}

export interface OrdersByStatusItem {
  status: string;
  count: number;
}

export interface RevenueByDayItem {
  date: string;
  total: number;
}

export interface DashboardAlertOrder {
  id: string;
  code: string;
  reason: string;
  status: string;
  priority: string;
  estimatedDelivery?: string | null;
}

export interface DashboardLowStockPart {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface DashboardAlerts {
  overdueOrders: DashboardAlertOrder[];
  lowStockParts: DashboardLowStockPart[];
}
