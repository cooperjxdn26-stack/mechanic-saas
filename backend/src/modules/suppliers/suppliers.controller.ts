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

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierQueryDto } from './dto/supplier-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  /*
   * Crear proveedor.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  /*
   * Listar proveedores.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get()
  findAll(@Query() query: SupplierQueryDto) {
    return this.suppliersService.findAll(query);
  }

  /*
   * Detalle proveedor.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  /*
   * Actualizar proveedor.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(id, dto);
  }

  /*
   * Desactivar proveedor.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.suppliersService.deactivate(id);
  }
}
