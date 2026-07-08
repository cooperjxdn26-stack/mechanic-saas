import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  VehicleFuelType,
  VehicleTransmission,
  VehicleType,
} from '@prisma/client';

export class CreateVehicleDto {
  /*
   * Placa del vehículo.
   * Será única en la base de datos.
   */
  @IsString()
  plate!: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  /*
   * VIN: número de identificación vehicular.
   */
  @IsOptional()
  @IsString()
  vin?: string;

  /*
   * Kilometraje actual del vehículo.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @IsOptional()
  @IsEnum(VehicleFuelType)
  fuelType?: VehicleFuelType;

  @IsOptional()
  @IsEnum(VehicleTransmission)
  transmission?: VehicleTransmission;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  notes?: string;

  /*
   * Cliente dueño del vehículo.
   */
  @IsString()
  customerId!: string;

  /*
   * Sucursal donde se registró o atiende normalmente.
   */
  @IsOptional()
  @IsString()
  branchId?: string;
}
