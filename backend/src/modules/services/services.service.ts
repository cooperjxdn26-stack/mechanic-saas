import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un servicio del catálogo.
   */
  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category ?? 'OTHER',
        basePrice: dto.basePrice ?? 0,
        estimatedTimeMinutes: dto.estimatedTimeMinutes,
        isActive: dto.isActive ?? true,
        companyId: dto.companyId,
      },
      include: {
        company: true,
      },
    });
  }

  /*
   * Lista servicios con filtros, búsqueda y paginación.
   */
  async findAll(query: ServiceQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.ServiceWhereInput = {
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.category ? { category: query.category } : {}),

      /*
       * Búsqueda por nombre o descripción.
       */
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
                description: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.service.count({
        where,
      }),
    ]);

    return {
      data: services,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Obtiene un servicio por ID.
   */
  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        quoteItems: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  /*
   * Actualiza servicio.
   */
  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);

    /*
     * Data tipada con Prisma.
     * Mantiene tu lógica de actualizar solo lo que viene en el DTO.
     */
    const data: Prisma.ServiceUncheckedUpdateInput = {
      ...dto,
    };

    return this.prisma.service.update({
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
   * No eliminamos el servicio porque puede estar asociado a cotizaciones pasadas.
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
