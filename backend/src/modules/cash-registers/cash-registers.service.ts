import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { OpenCashRegisterDto } from './dto/open-cash-register.dto';
import { CloseCashRegisterDto } from './dto/close-cash-register.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CashRegistersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera código legible de caja.
   * Ejemplo: CAJA-2026-000001
   */
  private async generateCode() {
    const year = new Date().getFullYear();

    const count = await this.prisma.cashRegister.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `CAJA-${year}-${nextNumber}`;
  }

  /*
   * Abre caja.
   * Recomendación: solo una caja abierta por sucursal.
   */
  async open(dto: OpenCashRegisterDto, userId?: string) {
    const existingOpenCash = await this.prisma.cashRegister.findFirst({
      where: {
        status: 'OPEN',
        ...(dto.branchId ? { branchId: dto.branchId } : {}),
      },
    });

    if (existingOpenCash) {
      throw new BadRequestException('Ya existe una caja abierta');
    }

    const code = await this.generateCode();

    return this.prisma.cashRegister.create({
      data: {
        code,
        status: 'OPEN',
        openingAmount: dto.openingAmount,
        notes: dto.notes,
        branchId: dto.branchId,
        openedById: userId,
      },
      include: {
        branch: true,
        openedBy: {
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
   * Lista cajas.
   */
  async findAll(status?: string, branchId?: string) {
    /*
     * Tipamos el status según lo que Prisma espera en CashRegisterWhereInput.
     * Así evitamos usar "as any".
     */
    type CashRegisterStatusWhere = NonNullable<
      Prisma.CashRegisterWhereInput['status']
    >;

    const where: Prisma.CashRegisterWhereInput = {
      ...(status ? { status: status as CashRegisterStatusWhere } : {}),
      ...(branchId ? { branchId } : {}),
    };

    return this.prisma.cashRegister.findMany({
      where,
      include: {
        branch: true,
        openedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: true,
      },
      orderBy: {
        openedAt: 'desc',
      },
    });
  }
  /*
   * Detalle de caja.
   */
  async findOne(id: string) {
    const cashRegister = await this.prisma.cashRegister.findUnique({
      where: {
        id,
      },
      include: {
        branch: true,
        openedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: 'desc',
          },
          include: {
            customer: true,
            invoice: true,
          },
        },
      },
    });

    if (!cashRegister) {
      throw new NotFoundException('Caja no encontrada');
    }

    return cashRegister;
  }

  /*
   * Obtiene caja abierta.
   */
  async getOpen(branchId?: string) {
    /*
     * Busca la última caja abierta.
     * Si trabajas con sucursales, también puede filtrar por branchId.
     */
    const cashRegister = await this.prisma.cashRegister.findFirst({
      where: {
        status: 'OPEN',
        ...(branchId ? { branchId } : {}),
      },
      include: {
        payments: {
          include: {
            customer: true,
            invoice: true,
          },
        },
        branch: true,
        openedBy: true,
      },
      orderBy: {
        openedAt: 'desc',
      },
    });

    if (!cashRegister) {
      throw new NotFoundException('No hay caja abierta');
    }

    return cashRegister;
  }
  /*
   * Cierra caja.
   * Calcula monto esperado y diferencia.
   */
  async close(id: string, dto: CloseCashRegisterDto) {
    const cashRegister = await this.prisma.cashRegister.findUnique({
      where: {
        id,
      },
      include: {
        payments: true,
      },
    });

    if (!cashRegister) {
      throw new NotFoundException('Caja no encontrada');
    }

    if (cashRegister.status !== 'OPEN') {
      throw new BadRequestException('La caja ya está cerrada');
    }

    /*
     * Monto esperado:
     * apertura + suma de pagos registrados en esta caja.
     */
    const paymentsTotal = cashRegister.payments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const expectedAmount = Number(cashRegister.openingAmount) + paymentsTotal;
    const difference = dto.closingAmount - expectedAmount;

    return this.prisma.cashRegister.update({
      where: {
        id,
      },
      data: {
        status: 'CLOSED',
        closingAmount: dto.closingAmount,
        expectedAmount,
        difference,
        closedAt: new Date(),
        notes: dto.notes ?? cashRegister.notes,
      },
      include: {
        payments: true,
        branch: true,
      },
    });
  }

  /*
   * Resumen de caja por métodos de pago.
   */
  async getSummary(id: string) {
    const cashRegister = await this.findOne(id);

    const paymentsTotal = cashRegister.payments.reduce((acc, payment) => {
      return acc + Number(payment.amount);
    }, 0);

    const byMethod = cashRegister.payments.reduce<Record<string, number>>(
      (acc, payment) => {
        const method = payment.method;

        acc[method] = (acc[method] ?? 0) + Number(payment.amount);

        return acc;
      },
      {},
    );

    return {
      cashRegisterId: cashRegister.id,
      code: cashRegister.code,
      status: cashRegister.status,
      openingAmount: Number(cashRegister.openingAmount),
      paymentsTotal,
      expectedAmount: Number(cashRegister.openingAmount) + paymentsTotal,
      closingAmount: cashRegister.closingAmount
        ? Number(cashRegister.closingAmount)
        : null,
      difference: cashRegister.difference
        ? Number(cashRegister.difference)
        : null,
      byMethod,
      paymentsCount: cashRegister.payments.length,
    };
  }
}
