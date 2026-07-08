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

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /*
   * Crear servicio.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  /*
   * Listar servicios.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get()
  findAll(@Query() query: ServiceQueryDto) {
    return this.servicesService.findAll(query);
  }

  /*
   * Detalle del servicio.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /*
   * Actualizar servicio.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  /*
   * Desactivar servicio.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.servicesService.deactivate(id);
  }
}
