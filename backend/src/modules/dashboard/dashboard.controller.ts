import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /*
   * KPIs principales del dashboard.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CASHIER')
  @Get('overview')
  getOverview(@Query('branchId') branchId?: string) {
    return this.dashboardService.getOverview(branchId);
  }

  /*
   * Órdenes agrupadas por estado.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('orders-by-status')
  getOrdersByStatus(@Query('branchId') branchId?: string) {
    return this.dashboardService.getOrdersByStatus(branchId);
  }

  /*
   * Ingresos por día.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('revenue-by-day')
  getRevenueByDay(@Query('from') from?: string, @Query('to') to?: string) {
    return this.dashboardService.getRevenueByDay(from, to);
  }

  /*
   * Clientes frecuentes.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('top-customers')
  getTopCustomers(@Query('limit') limit?: string) {
    return this.dashboardService.getTopCustomers(Number(limit) || 10);
  }

  /*
   * Ranking de mecánicos.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('mechanic-ranking')
  getMechanicRanking(@Query('from') from?: string, @Query('to') to?: string) {
    return this.dashboardService.getMechanicRanking(from, to);
  }

  /*
   * Alertas operativas: órdenes atrasadas y stock bajo.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @Get('alerts')
  getAlerts(@Query('branchId') branchId?: string) {
    return this.dashboardService.getAlerts(branchId);
  }
}
