import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Reporte de ventas.
   * Devuelve pagos/facturas listos para exportar a PDF o Excel.
   */
  async salesReport(query: ReportQueryDto) {
    const wherePayments: Prisma.PaymentWhereInput = {
      status: 'PAID',
      ...(query.from || query.to
        ? {
            paidAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const payments = await this.prisma.payment.findMany({
      where: wherePayments,
      include: {
        customer: true,
        invoice: true,
        receivedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
    });

    const total = payments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const byMethod = payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.method] = (acc[payment.method] ?? 0) + Number(payment.amount);

      return acc;
    }, {});

    return {
      title: 'Reporte de ventas',
      filters: query,
      summary: {
        total,
        count: payments.length,
        byMethod,
      },
      rows: payments.map((payment) => ({
        code: payment.code,
        date: payment.paidAt,
        customer: payment.customer?.name,
        invoice: payment.invoice?.code,
        method: payment.method,
        amount: Number(payment.amount),
        cashier: payment.receivedBy
          ? `${payment.receivedBy.firstName} ${payment.receivedBy.lastName}`
          : null,
      })),
    };
  }

  /*
   * Reporte de órdenes.
   */
  async workOrdersReport(query: ReportQueryDto) {
    const whereOrders: Prisma.WorkOrderWhereInput = {
      ...(query.branchId ? { branchId: query.branchId } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const orders = await this.prisma.workOrder.findMany({
      where: whereOrders,
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        mechanic: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const byStatus = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;

      return acc;
    }, {});

    return {
      title: 'Reporte de órdenes de trabajo',
      filters: query,
      summary: {
        total: orders.length,
        byStatus,
      },
      rows: orders.map((order) => ({
        code: order.code,
        status: order.status,
        priority: order.priority,
        reason: order.reason,
        customer: order.vehicle.customer.name,
        plate: order.vehicle.plate,
        vehicle: `${order.vehicle.brand} ${order.vehicle.model}`,
        mechanic: order.mechanic
          ? `${order.mechanic.firstName} ${order.mechanic.lastName}`
          : null,
        receivedAt: order.receivedAt,
        estimatedDelivery: order.estimatedDelivery,
      })),
    };
  }

  /*
   * Reporte de inventario.
   */
  async inventoryReport(query: ReportQueryDto) {
    const whereParts: Prisma.PartWhereInput = {
      ...(query.companyId ? { companyId: query.companyId } : {}),
    };

    const parts = await this.prisma.part.findMany({
      where: whereParts,
      include: {
        supplier: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const totalStockValue = parts.reduce((acc, part) => {
      return acc + part.stock * Number(part.purchasePrice);
    }, 0);

    const lowStock = parts.filter((part) => part.stock <= part.minStock);

    return {
      title: 'Reporte de inventario',
      filters: query,
      summary: {
        totalParts: parts.length,
        lowStockCount: lowStock.length,
        totalStockValue,
      },
      rows: parts.map((part) => ({
        name: part.name,
        sku: part.sku,
        code: part.code,
        category: part.category,
        brand: part.brand,
        stock: part.stock,
        minStock: part.minStock,
        purchasePrice: Number(part.purchasePrice),
        salePrice: Number(part.salePrice),
        stockValue: part.stock * Number(part.purchasePrice),
        supplier: part.supplier?.name,
        lowStock: part.stock <= part.minStock,
      })),
    };
  }

  /*
   * Reporte financiero básico.
   */
  async financialReport(query: ReportQueryDto) {
    const wherePayments: Prisma.PaymentWhereInput = {
      status: 'PAID',
      ...(query.from || query.to
        ? {
            paidAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const whereInvoices: Prisma.InvoiceWhereInput = {
      status: 'ISSUED',
      ...(query.from || query.to
        ? {
            issuedAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const whereQuotes: Prisma.QuoteWhereInput = {
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [payments, invoices, quotes] = await Promise.all([
      this.prisma.payment.findMany({
        where: wherePayments,
      }),

      this.prisma.invoice.findMany({
        where: whereInvoices,
      }),

      this.prisma.quote.findMany({
        where: whereQuotes,
      }),
    ]);

    const paidTotal = payments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const invoicedTotal = invoices.reduce((acc, invoice) => {
      return acc + Number(invoice.total);
    }, 0);

    const quotedTotal = quotes.reduce((acc, quote) => {
      return acc + Number(quote.total);
    }, 0);

    return {
      title: 'Reporte financiero',
      filters: query,
      summary: {
        paidTotal,
        invoicedTotal,
        quotedTotal,
        pendingCollection: invoicedTotal - paidTotal,
        paymentsCount: payments.length,
        invoicesCount: invoices.length,
        quotesCount: quotes.length,
      },
    };
  }

  /*
   * Reporte de mecánicos.
   */
  async mechanicsReport(query: ReportQueryDto) {
    const assignedOrdersWhere: Prisma.WorkOrderWhereInput = {
      ...(query.branchId ? { branchId: query.branchId } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const mechanics = await this.prisma.user.findMany({
      where: {
        role: {
          name: 'MECHANIC',
        },
      },
      include: {
        assignedOrders: {
          where: assignedOrdersWhere,
        },
      },
    });

    return {
      title: 'Reporte de mecánicos',
      filters: query,
      rows: mechanics.map((mechanic) => {
        const completed = mechanic.assignedOrders.filter((order) =>
          ['COMPLETED', 'DELIVERED'].includes(order.status),
        ).length;

        return {
          mechanic: `${mechanic.firstName} ${mechanic.lastName}`,
          email: mechanic.email,
          totalOrders: mechanic.assignedOrders.length,
          completedOrders: completed,
          activeOrders: mechanic.assignedOrders.length - completed,
        };
      }),
    };
  }
}
