import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /*
   * Registrar vehículo.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /*
   * Listar vehículos.
   * Ejemplo:
   * /api/vehicles?search=abc&page=1&limit=10
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get()
  findAll(@Query() query: VehicleQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  /*
   * Métricas rápidas.
   * Debe ir antes de /:id.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('stats')
  getStats(@Query('branchId') branchId?: string) {
    return this.vehiclesService.getStats(branchId);
  }

  /*
   * Historial del vehículo.
   * Ideal para timeline del frontend.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.vehiclesService.getHistory(id);
  }

  /*
   * Perfil completo del vehículo.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  /*
   * Actualizar vehículo.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /*
   * Eliminar vehículo.
   * Recomendado solo para administradores.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
