import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Dashboard principal del sistema.
   * Devuelve KPIs generales para la pantalla inicial.
   */
  async getOverview(branchId?: string) {
    /*
     * where base para consultas relacionadas a sucursal.
     * Evitamos any usando tipos seguros de Prisma.
     */
    const whereBranch: Prisma.WorkOrderWhereInput = {
      ...(branchId ? { branchId } : {}),
    };

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCustomers,
      totalVehicles,
      activeOrders,
      overdueOrders,
      completedOrders,
      lowStockParts,
      monthlyPayments,
      pendingQuotes,
    ] = await Promise.all([
      this.prisma.customer.count({
        where: {
          ...(branchId ? { branchId } : {}),
        },
      }),

      this.prisma.vehicle.count({
        where: {
          ...(branchId ? { branchId } : {}),
        },
      }),

      this.prisma.workOrder.count({
        where: {
          ...whereBranch,
          status: {
            in: [
              'PENDING',
              'RECEIVED',
              'IN_DIAGNOSIS',
              'WAITING_APPROVAL',
              'IN_REPAIR',
              'IN_TESTING',
            ],
          },
        },
      }),

      /*
       * Órdenes vencidas:
       * tienen fecha estimada menor a hoy y aún no fueron entregadas/canceladas.
       */
      this.prisma.workOrder.count({
        where: {
          ...whereBranch,
          estimatedDelivery: {
            lt: today,
          },
          status: {
            notIn: ['DELIVERED', 'CANCELLED'],
          },
        },
      }),

      this.prisma.workOrder.count({
        where: {
          ...whereBranch,
          status: {
            in: ['COMPLETED', 'DELIVERED'],
          },
        },
      }),

      /*
       * Repuestos con stock bajo.
       * Aquí traemos todos y filtramos por stock <= minStock.
       */
      this.prisma.part.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          stock: true,
          minStock: true,
        },
      }),

      this.prisma.payment.findMany({
        where: {
          status: 'PAID',
          paidAt: {
            gte: startOfMonth,
          },
        },
      }),

      this.prisma.quote.count({
        where: {
          status: {
            in: ['DRAFT', 'SENT'],
          },
        },
      }),
    ]);

    const monthlyRevenue = monthlyPayments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const lowStockCount = lowStockParts.filter((part) => {
      return part.stock <= part.minStock;
    }).length;

    return {
      totalCustomers,
      totalVehicles,
      activeOrders,
      overdueOrders,
      completedOrders,
      lowStockParts: lowStockCount,
      pendingQuotes,
      monthlyRevenue,
    };
  }

  /*
   * Cantidad de órdenes por estado.
   * Ideal para cards o gráfico de barras.
   */
  async getOrdersByStatus(branchId?: string) {
    const statuses = [
      'PENDING',
      'RECEIVED',
      'IN_DIAGNOSIS',
      'WAITING_APPROVAL',
      'IN_REPAIR',
      'IN_TESTING',
      'COMPLETED',
      'DELIVERED',
      'CANCELLED',
    ] as const;

    const result = await Promise.all(
      statuses.map(async (status) => {
        const count = await this.prisma.workOrder.count({
          where: {
            status,
            ...(branchId ? { branchId } : {}),
          },
        });

        return {
          status,
          count,
        };
      }),
    );

    return result;
  }

  /*
   * Ingresos agrupados por día.
   * Esto alimentará gráficos en Recharts.
   */
  async getRevenueByDay(from?: string, to?: string) {
    const where: Prisma.PaymentWhereInput = {
      status: 'PAID',

      ...(from || to
        ? {
            paidAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const payments = await this.prisma.payment.findMany({
      where,
      orderBy: {
        paidAt: 'asc',
      },
    });

    const grouped = payments.reduce<Record<string, number>>((acc, payment) => {
      const date = payment.paidAt.toISOString().split('T')[0];

      acc[date] = (acc[date] ?? 0) + Number(payment.amount);

      return acc;
    }, {});

    return Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));
  }

  /*
   * Clientes frecuentes por cantidad de vehículos y pagos.
   */
  async getTopCustomers(limit = 10) {
    const customers = await this.prisma.customer.findMany({
      include: {
        vehicles: true,
        payments: true,
      },
      take: limit,
      orderBy: {
        visitCount: 'desc',
      },
    });

    return customers.map((customer) => {
      const totalPaid = customer.payments.reduce((acc, payment) => {
        return acc + Number(payment.amount);
      }, 0);

      return {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        status: customer.status,
        visitCount: customer.visitCount,
        vehiclesCount: customer.vehicles.length,
        totalPaid,
      };
    });
  }

  /*
   * Ranking de mecánicos por órdenes asignadas/finalizadas.
   */
  async getMechanicRanking(from?: string, to?: string) {
    const assignedOrdersWhere: Prisma.WorkOrderWhereInput = {
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
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

    return mechanics
      .map((mechanic) => {
        const completed = mechanic.assignedOrders.filter((order) => {
          return ['COMPLETED', 'DELIVERED'].includes(order.status);
        }).length;

        return {
          id: mechanic.id,
          name: `${mechanic.firstName} ${mechanic.lastName}`,
          email: mechanic.email,
          totalOrders: mechanic.assignedOrders.length,
          completedOrders: completed,
        };
      })
      .sort((a, b) => b.completedOrders - a.completedOrders);
  }

  /*
   * Alertas inteligentes iniciales.
   * Más adelante aquí podemos conectar IA.
   */
  async getAlerts(branchId?: string) {
    const today = new Date();

    const overdueOrdersWhere: Prisma.WorkOrderWhereInput = {
      ...(branchId ? { branchId } : {}),
      estimatedDelivery: {
        lt: today,
      },
      status: {
        notIn: ['DELIVERED', 'CANCELLED'],
      },
    };

    const overdueOrders = await this.prisma.workOrder.findMany({
      where: overdueOrdersWhere,
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
      },
      take: 10,
      orderBy: {
        estimatedDelivery: 'asc',
      },
    });

    const parts = await this.prisma.part.findMany({
      where: {
        isActive: true,
      },
      include: {
        supplier: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });

    const lowStockParts = parts
      .filter((part) => {
        return part.stock <= part.minStock;
      })
      .slice(0, 10);

    return {
      overdueOrders,
      lowStockParts,
    };
  }
}
