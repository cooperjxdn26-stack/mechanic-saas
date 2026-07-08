import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../../database/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteQueryDto } from './dto/quote-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera código legible para cotización.
   * Ejemplo: COT-2026-000001
   */
  private async generateCode() {
    const year = new Date().getFullYear();

    const count = await this.prisma.quote.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `COT-${year}-${nextNumber}`;
  }

  /*
   * Calcula totales de la cotización.
   * Esta función centraliza reglas financieras.
   */
  private calculateTotals(
    items: CreateQuoteDto['items'],
    discount = 0,
    tax = 0,
  ) {
    const subtotal = items.reduce((acc, item) => {
      const itemDiscount = item.discount ?? 0;
      const itemTotal = item.quantity * item.unitPrice - itemDiscount;

      return acc + itemTotal;
    }, 0);

    const total = subtotal - discount + tax;

    if (total < 0) {
      throw new BadRequestException(
        'El total de la cotización no puede ser negativo',
      );
    }

    return {
      subtotal,
      discount,
      tax,
      total,
    };
  }

  /*
   * Crea cotización con items.
   */
  async create(dto: CreateQuoteDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'La cotización debe tener al menos un item',
      );
    }

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: dto.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (dto.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: {
          id: dto.vehicleId,
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehículo no encontrado');
      }
    }

    if (dto.workOrderId) {
      const order = await this.prisma.workOrder.findUnique({
        where: {
          id: dto.workOrderId,
        },
      });

      if (!order) {
        throw new NotFoundException('Orden de trabajo no encontrada');
      }
    }

    /*
     * Validamos que los servicios y repuestos existan si fueron enviados.
     */
    for (const item of dto.items) {
      if (item.serviceId) {
        const service = await this.prisma.service.findUnique({
          where: {
            id: item.serviceId,
          },
        });

        if (!service) {
          throw new NotFoundException(
            `Servicio no encontrado: ${item.serviceId}`,
          );
        }
      }

      if (item.partId) {
        const part = await this.prisma.part.findUnique({
          where: {
            id: item.partId,
          },
        });

        if (!part) {
          throw new NotFoundException(`Repuesto no encontrado: ${item.partId}`);
        }
      }
    }

    const code = await this.generateCode();

    const totals = this.calculateTotals(
      dto.items,
      dto.discount ?? 0,
      dto.tax ?? 0,
    );

    /*
     * publicToken será usado para aprobar/rechazar cotización desde un link público.
     */
    const publicToken = randomUUID();

    return this.prisma.quote.create({
      data: {
        code,
        status: dto.status ?? 'DRAFT',
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        notes: dto.notes,
        publicToken,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        workOrderId: dto.workOrderId,
        items: {
          create: dto.items.map((item) => {
            const itemDiscount = item.discount ?? 0;

            return {
              type: item.type,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: itemDiscount,
              total: item.quantity * item.unitPrice - itemDiscount,
              serviceId: item.serviceId,
              partId: item.partId,
            };
          }),
        },
      },
      include: {
        customer: true,
        vehicle: true,
        workOrder: true,
        items: {
          include: {
            service: true,
            part: true,
          },
        },
      },
    });
  }

  /*
   * Lista cotizaciones.
   */
  async findAll(query: QuoteQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.QuoteWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.vehicleId ? { vehicleId: query.vehicleId } : {}),
      ...(query.workOrderId ? { workOrderId: query.workOrderId } : {}),

      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),

      /*
       * Búsqueda por código, cliente y datos del vehículo.
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
              {
                vehicle: {
                  plate: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                vehicle: {
                  brand: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                vehicle: {
                  model: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [quotes, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          vehicle: true,
          workOrder: true,
          invoice: true,
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.quote.count({
        where,
      }),
    ]);

    return {
      data: quotes,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle completo de cotización.
   */
  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        vehicle: true,
        workOrder: true,
        invoice: true,
        items: {
          include: {
            service: true,
            part: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quote;
  }

  /*
   * Busca una cotización por token público.
   * Esta ruta se usará después en el portal del cliente.
   */
  async findByPublicToken(token: string) {
    const quote = await this.prisma.quote.findUnique({
      where: {
        publicToken: token,
      },
      include: {
        customer: true,
        vehicle: true,
        items: {
          include: {
            service: true,
            part: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quote;
  }

  /*
   * Actualiza una cotización.
   * No permitimos editar cotizaciones aprobadas, rechazadas o convertidas.
   */
  async update(id: string, dto: UpdateQuoteDto) {
    const quote = await this.findOne(id);

    if (['APPROVED', 'REJECTED', 'CONVERTED'].includes(quote.status)) {
      throw new BadRequestException(
        'No se puede editar una cotización aprobada, rechazada o convertida',
      );
    }

    /*
     * Si llegan nuevos items, recalculamos y reemplazamos items anteriores.
     */
    if (dto.items && dto.items.length > 0) {
      /*
       * Guardamos dto.items en una constante para que TypeScript entienda
       * que ya no es undefined dentro del map.
       */
      const items = dto.items;

      const totals = this.calculateTotals(
        items,
        dto.discount ?? 0,
        dto.tax ?? 0,
      );

      return this.prisma.$transaction(async (tx) => {
        await tx.quoteItem.deleteMany({
          where: {
            quoteId: id,
          },
        });

        return tx.quote.update({
          where: {
            id,
          },
          data: {
            status: dto.status,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
            notes: dto.notes,
            customerId: dto.customerId,
            vehicleId: dto.vehicleId,
            workOrderId: dto.workOrderId,
            items: {
              create: items.map((item) => {
                const itemDiscount = item.discount ?? 0;

                return {
                  type: item.type,
                  description: item.description,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  discount: itemDiscount,
                  total: item.quantity * item.unitPrice - itemDiscount,
                  serviceId: item.serviceId,
                  partId: item.partId,
                };
              }),
            },
          },
          include: {
            customer: true,
            vehicle: true,
            items: true,
          },
        });
      });
    }

    /*
     * Si no vienen items, solo actualizamos datos generales.
     */
    const data: Prisma.QuoteUncheckedUpdateInput = {
      status: dto.status,
      discount: dto.discount,
      tax: dto.tax,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      notes: dto.notes,
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      workOrderId: dto.workOrderId,
    };

    return this.prisma.quote.update({
      where: {
        id,
      },
      data,
      include: {
        customer: true,
        vehicle: true,
        items: true,
      },
    });
  }

  /*
   * Aprobar cotización.
   */
  async approve(id: string) {
    const quote = await this.findOne(id);

    if (quote.status === 'APPROVED') {
      throw new BadRequestException('La cotización ya está aprobada');
    }

    if (quote.status === 'REJECTED') {
      throw new BadRequestException(
        'No se puede aprobar una cotización rechazada',
      );
    }

    if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
      throw new BadRequestException('La cotización ya venció');
    }

    return this.prisma.quote.update({
      where: {
        id,
      },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
      include: {
        customer: true,
        vehicle: true,
        items: true,
      },
    });
  }

  /*
   * Rechazar cotización.
   */
  async reject(id: string) {
    const quote = await this.findOne(id);

    if (quote.status === 'APPROVED') {
      throw new BadRequestException(
        'No se puede rechazar una cotización aprobada',
      );
    }

    return this.prisma.quote.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
      },
    });
  }

  /*
   * Aprobar desde token público.
   * Ideal para portal del cliente.
   */
  async approveByToken(token: string) {
    const quote = await this.findByPublicToken(token);

    return this.approve(quote.id);
  }

  /*
   * Rechazar desde token público.
   */
  async rejectByToken(token: string) {
    const quote = await this.findByPublicToken(token);

    return this.reject(quote.id);
  }
}
