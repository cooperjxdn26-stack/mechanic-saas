import type { Branch } from "./user";
import type { Customer } from "./customer";

export type VehicleFuelType =
  | "GASOLINE"
  | "DIESEL"
  | "GAS"
  | "HYBRID"
  | "ELECTRIC"
  | "OTHER";

export type VehicleTransmission = "MANUAL" | "AUTOMATIC" | "CVT" | "OTHER";

export type VehicleType =
  | "SEDAN"
  | "SUV"
  | "PICKUP"
  | "VAN"
  | "TRUCK"
  | "MOTORCYCLE"
  | "OTHER";

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year?: number | null;
  color?: string | null;
  vin?: string | null;
  mileage: number;
  fuelType?: VehicleFuelType | null;
  transmission?: VehicleTransmission | null;
  type?: VehicleType | null;
  notes?: string | null;
  customerId: string;
  branchId?: string | null;
  customer?: Customer;
  branch?: Branch | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleQueryParams {
  search?: string;
  customerId?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

export interface CreateVehiclePayload {
  plate: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  vin?: string;
  mileage?: number;
  fuelType?: VehicleFuelType;
  transmission?: VehicleTransmission;
  type?: VehicleType;
  notes?: string;
  customerId: string;
  branchId?: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

export interface VehicleStats {
  total: number;
  withHighMileage: number;
  withReminders: number;
}

export interface VehicleHistory {
  id: string;
  plate: string;
  brand: string;
  model: string;
  workOrders?: VehicleHistoryWorkOrder[];
  maintenanceReminders?: VehicleMaintenanceReminder[];
  appointments?: VehicleAppointment[];
}

export interface VehicleHistoryWorkOrder {
  id: string;
  code: string;
  reason: string;
  status: string;
  priority: string;
  createdAt: string;
  diagnostics?: VehicleDiagnostic[];
  statusHistory?: VehicleStatusHistory[];
}

export interface VehicleDiagnostic {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

export interface VehicleStatusHistory {
  id: string;
  oldStatus?: string | null;
  newStatus: string;
  notes?: string | null;
  createdAt: string;
}

export interface VehicleMaintenanceReminder {
  id: string;
  title: string;
  description?: string | null;
  dueMileage?: number | null;
  dueDate?: string | null;
  status: string;
  createdAt: string;
}

export interface VehicleAppointment {
  id: string;
  title: string;
  status: string;
  startAt: string;
  endAt: string;
}
