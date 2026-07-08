import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseQueryDto } from './dto/purchase-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  /*
   * Crear compra.
   * Se registra el usuario autenticado para los movimientos de inventario,
   * si la compra entra como recibida.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(
    @Body() dto: CreatePurchaseDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.purchasesService.create(dto, user.id);
  }

  /*
   * Listar compras.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  findAll(@Query() query: PurchaseQueryDto) {
    return this.purchasesService.findAll(query);
  }

  /*
   * Detalle de compra.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  /*
   * Actualizar compra.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, dto);
  }

  /*
   * Recibir compra.
   * Esta ruta aumenta stock automáticamente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id/receive')
  receive(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.purchasesService.receive(id, user.id);
  }

  /*
   * Cancelar compra.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.purchasesService.cancel(id);
  }
}
