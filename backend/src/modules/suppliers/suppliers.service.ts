import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea proveedor.
   */
  async create(dto: CreateSupplierDto) {
    if (dto.ruc) {
      const existingRuc = await this.prisma.supplier.findFirst({
        where: {
          ruc: dto.ruc,
          companyId: dto.companyId,
        },
      });

      if (existingRuc) {
        throw new ConflictException('Ya existe un proveedor con este RUC');
      }
    }

    return this.prisma.supplier.create({
      data: {
        name: dto.name,
        ruc: dto.ruc,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        contactName: dto.contactName,
        notes: dto.notes,
        isActive: dto.isActive ?? true,
        companyId: dto.companyId,
      },
      include: {
        company: true,
      },
    });
  }

  /*
   * Lista proveedores con búsqueda y paginación.
   */
  async findAll(query: SupplierQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.SupplierWhereInput = {
      ...(query.companyId ? { companyId: query.companyId } : {}),

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
                ruc: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                phone: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                contactName: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          _count: {
            select: {
              parts: true,
              purchases: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.supplier.count({
        where,
      }),
    ]);

    return {
      data: suppliers,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle del proveedor con repuestos y compras.
   */
  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        parts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        purchases: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return supplier;
  }

  /*
   * Actualiza proveedor.
   */
  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);

    if (dto.ruc) {
      const existingRuc = await this.prisma.supplier.findFirst({
        where: {
          ruc: dto.ruc,
          id: {
            not: id,
          },
          companyId: dto.companyId,
        },
      });

      if (existingRuc) {
        throw new ConflictException('Ya existe otro proveedor con este RUC');
      }
    }

    /*
     * Data tipada con Prisma.
     * Mantiene tu lógica de actualizar lo que viene en el DTO.
     */
    const data: Prisma.SupplierUncheckedUpdateInput = {
      ...dto,
    };

    return this.prisma.supplier.update({
      where: {
        id,
      },
      data,
      include: {
        company: true,
      },
    });
  }

  /*
   * Desactivación lógica.
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.supplier.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
