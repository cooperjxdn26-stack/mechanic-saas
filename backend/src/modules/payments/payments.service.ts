import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera código legible de pago.
   * Ejemplo: PAY-2026-000001
   */
  private async generateCode() {
    const year = new Date().getFullYear();

    const count = await this.prisma.payment.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `PAY-${year}-${nextNumber}`;
  }

  /*
   * Registra un pago.
   * Este método también valida factura y caja.
   */
  async create(dto: CreatePaymentDto, userId?: string) {
    if (dto.invoiceId) {
      const invoice = await this.prisma.invoice.findUnique({
        where: {
          id: dto.invoiceId,
        },
        include: {
          payments: true,
        },
      });

      if (!invoice) {
        throw new NotFoundException('Factura no encontrada');
      }

      if (invoice.status === 'CANCELLED') {
        throw new BadRequestException('No se puede pagar una factura anulada');
      }

      /*
       * Validamos que no se pague más del total.
       */
      const paidAmount = invoice.payments.reduce((acc, payment) => {
        return acc + Number(payment.amount);
      }, 0);

      const remaining = Number(invoice.total) - paidAmount;

      if (dto.amount > remaining) {
        throw new BadRequestException(
          `El monto excede el saldo pendiente. Saldo: ${remaining}`,
        );
      }
    }

    if (dto.cashRegisterId) {
      const cashRegister = await this.prisma.cashRegister.findUnique({
        where: {
          id: dto.cashRegisterId,
        },
      });

      if (!cashRegister) {
        throw new NotFoundException('Caja no encontrada');
      }

      if (cashRegister.status !== 'OPEN') {
        throw new BadRequestException('La caja no está abierta');
      }
    }

    if (dto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id: dto.customerId,
        },
      });

      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    const code = await this.generateCode();

    return this.prisma.payment.create({
      data: {
        code,
        method: dto.method,
        status: dto.status ?? 'PAID',
        amount: dto.amount,
        reference: dto.reference,
        notes: dto.notes,
        customerId: dto.customerId,
        invoiceId: dto.invoiceId,
        cashRegisterId: dto.cashRegisterId,
        receivedById: userId,
      },
      include: {
        customer: true,
        invoice: true,
        cashRegister: true,
        receivedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /*
   * Lista pagos.
   */
  async findAll(query: PaymentQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para eliminar errores de unsafe assignment.
     */
    const where: Prisma.PaymentWhereInput = {
      ...(query.method ? { method: query.method } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.invoiceId ? { invoiceId: query.invoiceId } : {}),
      ...(query.cashRegisterId ? { cashRegisterId: query.cashRegisterId } : {}),

      ...(query.from || query.to
        ? {
            paidAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),

      /*
       * Búsqueda por código, referencia o nombre del cliente.
       */
      ...(query.search
        ? {
            OR: [
              {
                code: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                reference: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                customer: {
                  name: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          invoice: true,
          cashRegister: true,
          receivedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          paidAt: 'desc',
        },
      }),

      this.prisma.payment.count({
        where,
      }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle de pago.
   */
  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        invoice: true,
        cashRegister: true,
        receivedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    return payment;
  }

  /*
   * Resumen de pagos por método.
   */
  async getSummary(from?: string, to?: string) {
    /*
     * where tipado para evitar any.
     * Se filtran solo pagos con estado PAID.
     */
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
    });

    const total = payments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const byMethod = payments.reduce<Record<string, number>>((acc, payment) => {
      const method = payment.method;

      acc[method] = (acc[method] ?? 0) + Number(payment.amount);

      return acc;
    }, {});

    return {
      total,
      byMethod,
      count: payments.length,
    };
  }
}
