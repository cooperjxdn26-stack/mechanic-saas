import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CashRegistersService } from './cash-registers.service';
import { OpenCashRegisterDto } from './dto/open-cash-register.dto';
import { CloseCashRegisterDto } from './dto/close-cash-register.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('cash-registers')
export class CashRegistersController {
  constructor(private readonly cashRegistersService: CashRegistersService) {}

  /*
   * Abrir caja.
   * Se registra el usuario autenticado como responsable de apertura.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Post('open')
  open(
    @Body() dto: OpenCashRegisterDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.cashRegistersService.open(dto, user.id);
  }

  /*
   * Listar cajas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.cashRegistersService.findAll(status, branchId);
  }

  /*
   * Obtener caja abierta.
   *
   * Esta ruta se usa desde el frontend de pagos:
   * GET /cash-registers/open/current
   *
   * Debe ir antes de /:id para evitar que "open" sea tomado como id.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('open/current')
  getCurrentOpen(@Query('branchId') branchId?: string) {
    return this.cashRegistersService.getOpen(branchId);
  }

  /*
   * Obtener caja abierta.
   *
   * Ruta antigua mantenida por compatibilidad:
   * GET /cash-registers/open
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('open')
  getOpen(@Query('branchId') branchId?: string) {
    return this.cashRegistersService.getOpen(branchId);
  }

  /*
   * Resumen de caja.
   *
   * Debe ir antes de /:id.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get(':id/summary')
  getSummary(@Param('id') id: string) {
    return this.cashRegistersService.getSummary(id);
  }

  /*
   * Detalle de caja.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashRegistersService.findOne(id);
  }

  /*
   * Cerrar caja.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Patch(':id/close')
  close(@Param('id') id: string, @Body() dto: CloseCashRegisterDto) {
    return this.cashRegistersService.close(id, dto);
  }
}
