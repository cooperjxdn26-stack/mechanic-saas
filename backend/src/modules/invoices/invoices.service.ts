import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera código legible de factura.
   * Ejemplo: FAC-2026-000001
   */
  private async generateCode(): Promise<string> {
    const year = new Date().getFullYear();

    const count = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `FAC-${year}-${nextNumber}`;
  }

  /*
   * Alias para mantener compatibilidad interna.
   * Reutiliza generateCode() para evitar duplicar lógica.
   */
  private async generateInvoiceCode(): Promise<string> {
    return this.generateCode();
  }
  /*
   * Crea factura.
   * Si viene quoteId, toma los montos desde la cotización aprobada.
   */
  async create(dto: CreateInvoiceDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: dto.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    let subtotal = dto.subtotal ?? 0;
    let discount = dto.discount ?? 0;
    let tax = dto.tax ?? 0;
    let total = dto.total ?? 0;

    if (dto.quoteId) {
      const quote = await this.prisma.quote.findUnique({
        where: {
          id: dto.quoteId,
        },
        include: {
          invoice: true,
        },
      });

      if (!quote) {
        throw new NotFoundException('Cotización no encontrada');
      }

      if (quote.status !== 'APPROVED') {
        throw new BadRequestException(
          'Solo se puede facturar una cotización aprobada',
        );
      }

      if (quote.invoice) {
        throw new BadRequestException('Esta cotización ya tiene factura');
      }

      subtotal = Number(quote.subtotal);
      discount = Number(quote.discount);
      tax = Number(quote.tax);
      total = Number(quote.total);
    }

    if (total <= 0) {
      throw new BadRequestException(
        'El total de la factura debe ser mayor a cero',
      );
    }

    const code = await this.generateCode();

    return this.prisma.invoice.create({
      data: {
        code,
        status: 'ISSUED',
        subtotal,
        discount,
        tax,
        total,
        issuedAt: new Date(),
        pdfUrl: dto.pdfUrl,
        customerId: dto.customerId,
        quoteId: dto.quoteId,
        workOrderId: dto.workOrderId,
      },
      include: {
        customer: true,
        quote: true,
        workOrder: true,
        payments: true,
      },
    });
  }

  /*
   * Crea una factura desde una cotización aprobada.
   * Si ya existe una factura activa para esa cotización, devuelve la existente.
   */
  async createFromQuote(quoteId: string) {
    /*
     * Buscamos la cotización completa con cliente, orden e items.
     * Solo una cotización aprobada debe convertirse en factura.
     */
    const quote = await this.prisma.quote.findUnique({
      where: {
        id: quoteId,
      },
      include: {
        customer: true,
        workOrder: true,
        items: true,
      },
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    if (quote.status !== 'APPROVED') {
      throw new BadRequestException(
        'Solo se puede generar factura desde una cotización aprobada',
      );
    }

    /*
     * Evitamos duplicar factura si la cotización ya tiene una factura asociada.
     */
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: {
        quoteId: quote.id,
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        customer: true,
        quote: true,
        workOrder: true,
        payments: true,
      },
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    /*
     * Usamos el método correcto existente en este servicio.
     * Antes estaba generateInvoiceCode(), pero ese método no existe.
     */
    const code = await this.generateCode();

    /*
     * Transacción:
     * 1. Crea la factura.
     * 2. Marca la cotización como CONVERTED.
     */
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          code,
          status: 'ISSUED',
          subtotal: quote.subtotal,
          discount: quote.discount,
          tax: quote.tax,
          total: quote.total,
          issuedAt: new Date(),
          customerId: quote.customerId,
          quoteId: quote.id,
          workOrderId: quote.workOrderId,
        },
        include: {
          customer: true,
          quote: true,
          workOrder: true,
          payments: true,
        },
      });

      /*
       * Marcamos la cotización como convertida.
       */
      await tx.quote.update({
        where: {
          id: quote.id,
        },
        data: {
          status: 'CONVERTED',
        },
      });

      return invoice;
    });
  }

  /*
   * Listar facturas.
   */
  async findAll(query: InvoiceQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para quitar errores de unsafe assignment.
     */
    const where: Prisma.InvoiceWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.quoteId ? { quoteId: query.quoteId } : {}),
      ...(query.workOrderId ? { workOrderId: query.workOrderId } : {}),

      ...(query.from || query.to
        ? {
            issuedAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),

      /*
       * Búsqueda por código de factura o nombre del cliente.
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

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          quote: true,
          workOrder: true,
          payments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.invoice.count({
        where,
      }),
    ]);

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle de factura.
   */
  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        quote: {
          include: {
            items: true,
          },
        },
        workOrder: true,
        payments: {
          orderBy: {
            paidAt: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    return invoice;
  }

  /*
   * Anular factura.
   * No se borra por trazabilidad.
   */
  async cancel(id: string) {
    await this.findOne(id);

    return this.prisma.invoice.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
