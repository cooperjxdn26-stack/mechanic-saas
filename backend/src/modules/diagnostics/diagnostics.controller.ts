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

import { DiagnosticsService } from './diagnostics.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('diagnostics')
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  /*
   * Crear diagnóstico.
   * Se usa el usuario autenticado como mecánico o responsable del diagnóstico.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'MECHANIC')
  @Post()
  create(
    @Body() createDiagnosticDto: CreateDiagnosticDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.diagnosticsService.create(createDiagnosticDto, user.id);
  }

  /*
   * Listar diagnósticos.
   * Se puede filtrar:
   * /api/diagnostics?workOrderId=ID
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Get()
  findAll(@Query('workOrderId') workOrderId?: string) {
    return this.diagnosticsService.findAll(workOrderId);
  }

  /*
   * Detalle de diagnóstico.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosticsService.findOne(id);
  }

  /*
   * Actualizar diagnóstico.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'MECHANIC')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosticDto: UpdateDiagnosticDto,
  ) {
    return this.diagnosticsService.update(id, updateDiagnosticDto);
  }

  /*
   * Eliminar diagnóstico.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosticsService.remove(id);
  }
}
