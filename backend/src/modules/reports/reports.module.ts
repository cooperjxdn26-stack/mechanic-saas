import { Module } from '@nestjs/common';

import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../../database/prisma.module';

/*
 * Módulo de reportes.
 *
 * Este módulo conecta:
 * - ReportsController: expone las rutas /reports/...
 * - ReportsService: contiene la lógica de ventas, órdenes, inventario,
 *   financiero y mecánicos.
 * - PrismaModule: permite usar PrismaService dentro de ReportsService.
 */
@Module({
  imports: [
    /*
     * PrismaModule es necesario porque ReportsService inyecta PrismaService.
     * La ruta correcta desde src/modules/reports es:
     * ../../database/prisma.module
     */
    PrismaModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [
    /*
     * Exportamos ReportsService por si otro módulo necesita usar reportes.
     */
    ReportsService,
  ],
})
export class ReportsModule {}
