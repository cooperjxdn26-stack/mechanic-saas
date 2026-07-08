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

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /*
   * Crear cliente.
   * Lo pueden hacer administradores y recepcionistas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  /*
   * Listar clientes.
   * Soporta filtros:
   * /api/customers?search=juan&page=1&limit=10
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CASHIER')
  @Get()
  findAll(@Query() query: CustomerQueryDto) {
    return this.customersService.findAll(query);
  }

  /*
   * Métricas rápidas del CRM.
   * Importante: esta ruta debe ir antes de /:id.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('stats')
  getStats(
    @Query('companyId') companyId?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.customersService.getStats(companyId, branchId);
  }

  /*
   * Perfil 360 del cliente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CASHIER', 'MECHANIC')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  /*
   * Actualizar cliente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  /*
   * Desactivar cliente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.customersService.deactivate(id);
  }
}
