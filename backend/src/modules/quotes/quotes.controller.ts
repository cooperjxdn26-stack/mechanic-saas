import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteQueryDto } from './dto/quote-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  /*
   * Crear cotización.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Post()
  create(@Body() dto: CreateQuoteDto) {
    return this.quotesService.create(dto);
  }

  /*
   * Listar cotizaciones.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CASHIER')
  @Get()
  findAll(@Query() query: QuoteQueryDto) {
    return this.quotesService.findAll(query);
  }

  /*
   * Vista pública por token.
   * No necesita JWT.
   */
  @Public()
  @Get('public/:token')
  findByPublicToken(@Param('token') token: string) {
    return this.quotesService.findByPublicToken(token);
  }

  /*
   * Aprobar cotización desde portal público.
   */
  @Public()
  @Patch('public/:token/approve')
  approveByToken(@Param('token') token: string) {
    return this.quotesService.approveByToken(token);
  }

  /*
   * Rechazar cotización desde portal público.
   */
  @Public()
  @Patch('public/:token/reject')
  rejectByToken(@Param('token') token: string) {
    return this.quotesService.rejectByToken(token);
  }

  /*
   * Detalle privado.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  /*
   * Actualizar cotización.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuoteDto) {
    return this.quotesService.update(id, dto);
  }

  /*
   * Aprobar desde panel interno.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.quotesService.approve(id);
  }

  /*
   * Rechazar desde panel interno.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.quotesService.reject(id);
  }
}
