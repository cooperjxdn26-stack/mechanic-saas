import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { WorkOrdersService } from './work-orders.service';

import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { WorkOrderQueryDto } from './dto/work-order-query.dto';
import { ChangeWorkOrderStatusDto } from './dto/change-work-order-status.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  /*
   * Crear orden de trabajo.
   * Se toma el usuario autenticado para registrar quién creó la orden.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Post()
  create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.workOrdersService.create(createWorkOrderDto, user.id);
  }

  /*
   * Listado general con filtros y paginación.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get()
  findAll(@Query() query: WorkOrderQueryDto) {
    return this.workOrdersService.findAll(query);
  }

  /*
   * Métricas rápidas.
   * Debe ir antes de /:id para evitar conflicto con rutas dinámicas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('stats')
  getStats(@Query('branchId') branchId?: string) {
    return this.workOrdersService.getStats(branchId);
  }

  /*
   * Kanban de órdenes por estado.
   * Útil para vista drag and drop en frontend.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Get('kanban')
  getKanban(@Query('branchId') branchId?: string) {
    return this.workOrdersService.getKanban(branchId);
  }

  /*
   * Panel del mecánico.
   * Ejemplo:
   * /api/work-orders/mechanic/USER_ID
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'MECHANIC')
  @Get('mechanic/:mechanicId')
  getMechanicPanel(@Param('mechanicId') mechanicId: string) {
    return this.workOrdersService.getMechanicPanel(mechanicId);
  }

  /*
   * Timeline de reparación.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Get(':id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.workOrdersService.getTimeline(id);
  }

  /*
   * Detalle completo de orden.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  /*
   * Actualizar datos generales de una orden.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto);
  }

  /*
   * Cambiar estado de orden.
   * Esto también crea historial automáticamente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeWorkOrderStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.workOrdersService.changeStatus(id, dto, user.id);
  }

  /*
   * Agregar item al checklist.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'MECHANIC')
  @Post(':id/checklist')
  addChecklistItem(
    @Param('id') id: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.workOrdersService.addChecklistItem(id, dto);
  }

  /*
   * Actualizar item del checklist.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'MECHANIC')
  @Patch('checklist/:checklistId')
  updateChecklistItem(
    @Param('checklistId') checklistId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.workOrdersService.updateChecklistItem(checklistId, dto);
  }
}
