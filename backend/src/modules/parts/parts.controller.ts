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

import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartQueryDto } from './dto/part-query.dto';
import { InventoryMovementDto } from './dto/inventory-movement.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  /*
   * Crear repuesto.
   * Se registra el usuario autenticado como creador del movimiento inicial,
   * si el repuesto se crea con stock inicial.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() dto: CreatePartDto, @CurrentUser() user: CurrentUserPayload) {
    return this.partsService.create(dto, user.id);
  }

  /*
   * Listar repuestos.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get()
  findAll(@Query() query: PartQueryDto) {
    return this.partsService.findAll(query);
  }

  /*
   * Alertas de stock bajo.
   * Debe ir antes de /:id para evitar conflicto con rutas dinámicas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('low-stock')
  getLowStock(@Query('companyId') companyId?: string) {
    return this.partsService.getLowStock(companyId);
  }

  /*
   * Kardex de repuesto.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get(':id/kardex')
  getKardex(@Param('id') id: string) {
    return this.partsService.getKardex(id);
  }

  /*
   * Detalle de repuesto.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(id);
  }

  /*
   * Actualizar repuesto.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartDto) {
    return this.partsService.update(id, dto);
  }

  /*
   * Crear movimiento manual de inventario.
   * Se registra el usuario autenticado como responsable del movimiento.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post(':id/movements')
  createMovement(
    @Param('id') id: string,
    @Body() dto: InventoryMovementDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.partsService.createMovement(id, dto, user.id);
  }

  /*
   * Desactivar repuesto.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.partsService.deactivate(id);
  }
}
