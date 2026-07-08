import { Controller, Get, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /*
   * Reporte de ventas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('sales')
  salesReport(@Query() query: ReportQueryDto) {
    return this.reportsService.salesReport(query);
  }

  /*
   * Reporte de órdenes.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('work-orders')
  workOrdersReport(@Query() query: ReportQueryDto) {
    return this.reportsService.workOrdersReport(query);
  }

  /*
   * Reporte de inventario.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('inventory')
  inventoryReport(@Query() query: ReportQueryDto) {
    return this.reportsService.inventoryReport(query);
  }

  /*
   * Reporte financiero.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('financial')
  financialReport(@Query() query: ReportQueryDto) {
    return this.reportsService.financialReport(query);
  }

  /*
   * Reporte de mecánicos.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('mechanics')
  mechanicsReport(@Query() query: ReportQueryDto) {
    return this.reportsService.mechanicsReport(query);
  }
}
