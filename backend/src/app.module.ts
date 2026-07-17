import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './database/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { WorkOrdersModule } from './modules/work-orders/work-orders.module';
import { DiagnosticsModule } from './modules/diagnostics/diagnostics.module';
import { ServicesModule } from './modules/services/services.module';
import { PartsModule } from './modules/parts/parts.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CashRegistersModule } from './modules/cash-registers/cash-registers.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { ComplaintBookModule } from './modules/complaint-book/complaint-book.module';
import { ContinuityModule } from './continuity/continuity.module';

@Module({
  imports: [
    /*
     * ConfigModule permite leer variables del archivo .env.
     * isGlobal: true evita importarlo módulo por módulo.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /*
     * PrismaModule conecta NestJS con PostgreSQL mediante Prisma.
     */
    PrismaModule,

    /*
     * Módulos principales del sistema.
     */
    AuthModule,
    UsersModule,
    RolesModule,
    CustomersModule,
    VehiclesModule,
    WorkOrdersModule,
    DiagnosticsModule,
    ServicesModule,
    PartsModule,
    SuppliersModule,
    PurchasesModule,
    QuotesModule,
    InvoicesModule,
    PaymentsModule,
    CashRegistersModule,
    DashboardModule,
    ReportsModule,
    NotificationsModule,
    AuditLogsModule,
    ComplaintBookModule,
    ContinuityModule,
  ],

  providers: [
    /*
     * JwtAuthGuard como guard global:
     * por defecto todas las rutas estarán protegidas.
     * Solo serán públicas las rutas marcadas con @Public().
     */
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    /*
     * RolesGuard valida permisos por rol cuando usemos @Roles().
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
