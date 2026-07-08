import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /*
   * Crear auditoría manual.
   *
   * En producción, normalmente los registros se crean automáticamente
   * desde los servicios del sistema.
   *
   * Este endpoint sirve para pruebas, soporte o registros manuales.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditLogsService.create(dto);
  }

  /*
   * Listar registros de auditoría.
   *
   * Permite filtros por query params:
   * /audit-logs?page=1&limit=10
   * /audit-logs?action=CREATE
   * /audit-logs?module=Customers
   * /audit-logs?entity=WorkOrder
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  findAll(@Query() query: AuditLogQueryDto) {
    return this.auditLogsService.findAll(query);
  }

  /*
   * Buscar auditoría por entidad.
   *
   * Ejemplo:
   * /audit-logs/entity/WorkOrder/ID_ORDEN
   *
   * Esto devuelve el historial completo de una entidad específica.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('entity/:entity/:entityId')
  findByEntity(
    @Param('entity') entity: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogsService.findByEntity(entity, entityId);
  }
}
