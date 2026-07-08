import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartQueryDto } from './dto/part-query.dto';
import { InventoryMovementDto } from './dto/inventory-movement.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PartsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un repuesto.
   * Si tiene stock inicial, también crea un movimiento de inventario.
   */
  async create(dto: CreatePartDto, userId?: string) {
    if (dto.sku) {
      const existingSku = await this.prisma.part.findUnique({
        where: {
          sku: dto.sku,
        },
      });

      if (existingSku) {
        throw new ConflictException('Ya existe un repuesto con este SKU');
      }
    }

    /*
     * Validamos proveedor si fue enviado.
     */
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

    const initialStock = dto.stock ?? 0;

    /*
     * Transacción:
     * crea el repuesto y, si corresponde, registra entrada inicial de stock.
     */
    return this.prisma.$transaction(async (tx) => {
      const part = await tx.part.create({
        data: {
          name: dto.name,
          code: dto.code,
          sku: dto.sku,
          category: dto.category,
          brand: dto.brand,
          description: dto.description,
          stock: initialStock,
          minStock: dto.minStock ?? 0,
          purchasePrice: dto.purchasePrice ?? 0,
          salePrice: dto.salePrice ?? 0,
          location: dto.location,
          isActive: dto.isActive ?? true,
          companyId: dto.companyId,
          supplierId: dto.supplierId,
        },
        include: {
          company: true,
          supplier: true,
        },
      });

      /*
       * Si se crea con stock inicial mayor a 0,
       * registramos el movimiento para que el Kardex no quede vacío.
       */
      if (initialStock > 0) {
        await tx.inventoryMovement.create({
          data: {
            type: 'IN',
            quantity: initialStock,
            previousStock: 0,
            newStock: initialStock,
            reason: 'Stock inicial',
            reference: 'INITIAL_STOCK',
            partId: part.id,
            createdById: userId,
          },
        });
      }

      return part;
    });
  }

  /*
   * Lista repuestos con búsqueda, filtros, paginación y stock bajo.
   */
  async findAll(query: PartQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.PartWhereInput = {
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.brand ? { brand: query.brand } : {}),

      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                code: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                sku: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                brand: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                category: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    /*
     * Prisma no permite comparar directamente stock <= minStock
     * de forma simple en todos los casos.
     * Por eso filtramos lowStock después de traer los registros.
     * Para producción grande, esto se puede optimizar con SQL raw.
     */
    const [partsRaw, totalRaw] = await Promise.all([
      this.prisma.part.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          supplier: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.part.count({
        where,
      }),
    ]);

    const parts = query.lowStock
      ? partsRaw.filter((part) => part.stock <= part.minStock)
      : partsRaw;

    const total = query.lowStock ? parts.length : totalRaw;

    return {
      data: parts,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Obtiene un repuesto por ID.
   */
  async findOne(id: string) {
    const part = await this.prisma.part.findUnique({
      where: { id },
      include: {
        company: true,
        supplier: true,
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        purchaseItems: {
          include: {
            purchase: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!part) {
      throw new NotFoundException('Repuesto no encontrado');
    }

    return part;
  }

  /*
   * Actualiza datos del repuesto.
   * No se recomienda actualizar stock directamente desde aquí.
   * Para stock usamos movimientos de inventario.
   */
  async update(id: string, dto: UpdatePartDto) {
    await this.findOne(id);

    if (dto.sku) {
      const existingSku = await this.prisma.part.findFirst({
        where: {
          sku: dto.sku,
          id: {
            not: id,
          },
        },
      });

      if (existingSku) {
        throw new ConflictException('Ya existe otro repuesto con este SKU');
      }
    }

    /*
     * Data explícita para mantener tu lógica de actualización controlada.
     */
    const data: Prisma.PartUncheckedUpdateInput = {
      name: dto.name,
      code: dto.code,
      sku: dto.sku,
      category: dto.category,
      brand: dto.brand,
      description: dto.description,
      minStock: dto.minStock,
      purchasePrice: dto.purchasePrice,
      salePrice: dto.salePrice,
      location: dto.location,
      isActive: dto.isActive,
      companyId: dto.companyId,
      supplierId: dto.supplierId,
    };

    return this.prisma.part.update({
      where: { id },
      data,
      include: {
        company: true,
        supplier: true,
      },
    });
  }

  /*
   * Registra un movimiento manual de inventario.
   * Esta función es crítica porque modifica stock y crea Kardex.
   * Además, si el repuesto queda con stock bajo, genera una notificación interna.
   */
  async createMovement(
    partId: string,
    dto: InventoryMovementDto,
    userId?: string,
  ) {
    const part = await this.prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part) {
      throw new NotFoundException('Repuesto no encontrado');
    }

    const previousStock = part.stock;
    let newStock = previousStock;

    /*
     * Reglas de movimiento:
     * IN suma stock.
     * OUT resta stock.
     * RETURN suma stock.
     * LOSS resta stock.
     * ADJUSTMENT reemplaza stock con la cantidad enviada.
     */
    switch (dto.type) {
      case 'IN':
      case 'RETURN':
        newStock = previousStock + dto.quantity;
        break;

      case 'OUT':
      case 'LOSS':
        newStock = previousStock - dto.quantity;
        break;

      case 'ADJUSTMENT':
        newStock = dto.quantity;
        break;
    }

    if (newStock < 0) {
      throw new BadRequestException(
        'No hay stock suficiente para este movimiento',
      );
    }

    /*
     * Transacción:
     * actualiza stock, registra movimiento en Kardex
     * y genera alerta si queda en stock bajo.
     */
    return this.prisma.$transaction(async (tx) => {
      const updatedPart = await tx.part.update({
        where: { id: partId },
        data: {
          stock: newStock,
        },
        include: {
          supplier: true,
          company: true,
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          type: dto.type,
          quantity: dto.quantity,
          previousStock,
          newStock,
          reason: dto.reason,
          reference: dto.reference,
          partId,
          branchId: dto.branchId,
          createdById: userId,
        },
      });

      /*
       * Notificación automática de stock bajo.
       * Se crea cuando el nuevo stock queda igual o por debajo del mínimo.
       */
      if (newStock <= part.minStock) {
        await tx.notification.create({
          data: {
            title: 'Stock bajo de repuesto',
            message: `El repuesto "${part.name}" quedó con stock bajo. Stock actual: ${newStock}. Stock mínimo: ${part.minStock}.`,
            type: 'INTERNAL',
            status: 'PENDING',
            actionUrl: `/dashboard/parts/${part.id}`,
            userId: userId,
          },
        });
      }

      return {
        part: updatedPart,
        movement,
      };
    });
  }

  /*
   * Kardex de un repuesto.
   * Muestra todos sus movimientos ordenados.
   */
  async getKardex(partId: string) {
    await this.findOne(partId);

    const movements = await this.prisma.inventoryMovement.findMany({
      where: {
        partId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        branch: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      partId,
      movements,
    };
  }

  /*
   * Alertas de stock bajo.
   */
  async getLowStock(companyId?: string) {
    const where: Prisma.PartWhereInput = {
      ...(companyId ? { companyId } : {}),
      isActive: true,
    };

    const parts = await this.prisma.part.findMany({
      where,
      include: {
        supplier: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });

    return parts.filter((part) => part.stock <= part.minStock);
  }

  /*
   * Desactiva repuesto.
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.part.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
