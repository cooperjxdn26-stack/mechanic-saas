import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';

/*
 * Permite actualizar parcialmente los datos del vehículo.
 */
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
