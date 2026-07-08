import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  /*
   * Crear factura.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  /*
   * Listar facturas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get()
  findAll(@Query() query: InvoiceQueryDto) {
    return this.invoicesService.findAll(query);
  }

  @Post('from-quote/:quoteId')
  createFromQuote(@Param('quoteId') quoteId: string) {
    /*
     * Genera una factura desde una cotización aprobada.
     * Si ya existe una factura para esa cotización, retorna la existente.
     */
    return this.invoicesService.createFromQuote(quoteId);
  }

  /*
   * Detalle de factura.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  /*
   * Anular factura.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.invoicesService.cancel(id);
  }
}
