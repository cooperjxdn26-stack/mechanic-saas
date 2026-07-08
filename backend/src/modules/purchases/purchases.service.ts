import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseQueryDto } from './dto/purchase-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera código legible de compra.
   * Ejemplo: COMP-2026-000001
   */
  private async generateCode() {
    const year = new Date().getFullYear();

    const count = await this.prisma.purchase.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `COMP-${year}-${nextNumber}`;
  }

  /*
   * Crea una compra.
   * Si el estado viene como RECEIVED, automáticamente entra stock y crea movimientos.
   */
  async create(dto: CreatePurchaseDto, userId?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La compra debe tener al menos un item');
    }

    if (dto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: dto.supplierId,
        },
      });

      if (!supplier) {
        throw new NotFoundException('Proveedor no encontrado');
      }
    }

    /*
     * Validamos que todos los repuestos existan.
     */
    for (const item of dto.items) {
      const part = await this.prisma.part.findUnique({
        where: {
          id: item.partId,
        },
      });

      if (!part) {
        throw new NotFoundException(`Repuesto no encontrado: ${item.partId}`);
      }
    }

    const code = await this.generateCode();

    const subtotal = dto.items.reduce((acc, item) => {
      return acc + item.quantity * item.unitPrice;
    }, 0);

    const tax = dto.tax ?? 0;
    const total = subtotal + tax;
    const status = dto.status ?? 'DRAFT';

    /*
     * Transacción:
     * crea compra, items, y si está RECEIVED actualiza stock + Kardex.
     */
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          code,
          status,
          subtotal,
          tax,
          total,
          notes: dto.notes,
          supplierId: dto.supplierId,
          branchId: dto.branchId,
          items: {
            create: dto.items.map((item) => ({
              partId: item.partId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          supplier: true,
          branch: true,
          items: {
            include: {
              part: true,
            },
          },
        },
      });

      /*
       * Si la compra ya se registra como recibida,
       * incrementamos stock automáticamente.
       */
      if (status === 'RECEIVED') {
        for (const item of purchase.items) {
          const previousStock = item.part.stock;
          const newStock = previousStock + item.quantity;

          await tx.part.update({
            where: {
              id: item.partId,
            },
            data: {
              stock: newStock,
              purchasePrice: item.unitPrice,
            },
          });

          /*
           * Movimiento de inventario.
           * Este registro alimenta el Kardex del repuesto.
           */
          await tx.inventoryMovement.create({
            data: {
              type: 'IN',
              quantity: item.quantity,
              previousStock,
              newStock,
              reason: 'Compra recibida',
              reference: purchase.code,
              partId: item.partId,
              branchId: dto.branchId,
              createdById: userId,
            },
          });
        }
      }

      return purchase;
    });
  }

  /*
   * Lista compras con filtros y paginación.
   */
  async findAll(query: PurchaseQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.PurchaseWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.branchId ? { branchId: query.branchId } : {}),

      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),

      /*
       * Búsqueda por código, nombre de proveedor o RUC.
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
                supplier: {
                  name: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                supplier: {
                  ruc: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [purchases, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        include: {
          supplier: true,
          branch: true,
          items: {
            include: {
              part: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.purchase.count({
        where,
      }),
    ]);

    return {
      data: purchases,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle de compra.
   */
  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Compra no encontrada');
    }

    return purchase;
  }

  /*
   * Actualizar compra.
   * Recomendado para compras DRAFT u ORDERED.
   */
  async update(id: string, dto: UpdatePurchaseDto) {
    const purchase = await this.findOne(id);

    if (purchase.status === 'RECEIVED') {
      throw new BadRequestException(
        'No se puede editar una compra que ya fue recibida',
      );
    }

    /*
     * Data tipada con Prisma.
     * Se mantiene la lógica de actualizar solo campos generales.
     */
    const data: Prisma.PurchaseUncheckedUpdateInput = {
      status: dto.status,
      tax: dto.tax,
      notes: dto.notes,
      supplierId: dto.supplierId,
      branchId: dto.branchId,
    };

    /*
     * Para simplificar, aquí actualizamos campos generales.
     * Los items pueden manejarse con endpoints específicos más adelante.
     */
    return this.prisma.purchase.update({
      where: {
        id,
      },
      data,
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            part: true,
          },
        },
      },
    });
  }

  /*
   * Marca una compra como recibida.
   * Esta es otra función crítica:
   * cambia estado, aumenta stock y crea movimientos.
   */
  async receive(id: string, userId?: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Compra no encontrada');
    }

    if (purchase.status === 'RECEIVED') {
      throw new BadRequestException('La compra ya fue recibida');
    }

    if (purchase.status === 'CANCELLED') {
      throw new BadRequestException('No puedes recibir una compra cancelada');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.purchase.update({
        where: {
          id,
        },
        data: {
          status: 'RECEIVED',
        },
        include: {
          supplier: true,
          branch: true,
          items: {
            include: {
              part: true,
            },
          },
        },
      });

      /*
       * Por cada item recibido, aumentamos el stock.
       */
      for (const item of purchase.items) {
        const previousStock = item.part.stock;
        const newStock = previousStock + item.quantity;

        await tx.part.update({
          where: {
            id: item.partId,
          },
          data: {
            stock: newStock,
            purchasePrice: item.unitPrice,
          },
        });

        /*
         * Registro Kardex.
         */
        await tx.inventoryMovement.create({
          data: {
            type: 'IN',
            quantity: item.quantity,
            previousStock,
            newStock,
            reason: 'Compra recibida',
            reference: purchase.code,
            partId: item.partId,
            branchId: purchase.branchId,
            createdById: userId,
          },
        });
      }

      return updatedPurchase;
    });
  }

  /*
   * Cancela una compra si aún no fue recibida.
   */
  async cancel(id: string) {
    const purchase = await this.findOne(id);

    if (purchase.status === 'RECEIVED') {
      throw new BadRequestException(
        'No puedes cancelar una compra que ya ingresó a inventario',
      );
    }

    return this.prisma.purchase.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
