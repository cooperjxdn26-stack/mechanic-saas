import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un cliente nuevo.
   * Validamos documento y correo para evitar duplicados básicos
   * dentro de la misma empresa.
   */
  async create(createCustomerDto: CreateCustomerDto) {
    if (createCustomerDto.documentNumber) {
      const existingDocument = await this.prisma.customer.findFirst({
        where: {
          documentNumber: createCustomerDto.documentNumber,
          companyId: createCustomerDto.companyId,
        },
      });

      if (existingDocument) {
        throw new ConflictException('Ya existe un cliente con este documento');
      }
    }

    if (createCustomerDto.email) {
      const existingEmail = await this.prisma.customer.findFirst({
        where: {
          email: createCustomerDto.email,
          companyId: createCustomerDto.companyId,
        },
      });

      if (existingEmail) {
        throw new ConflictException('Ya existe un cliente con este correo');
      }
    }

    return this.prisma.customer.create({
      data: {
        type: createCustomerDto.type,
        status: createCustomerDto.status,
        name: createCustomerDto.name,
        documentNumber: createCustomerDto.documentNumber,
        phone: createCustomerDto.phone,
        email: createCustomerDto.email,
        address: createCustomerDto.address,
        notes: createCustomerDto.notes,
        tags: createCustomerDto.tags ?? [],
        trustLevel: createCustomerDto.trustLevel ?? 0,
        companyId: createCustomerDto.companyId,
        branchId: createCustomerDto.branchId,
      },
      include: {
        company: true,
        branch: true,
        vehicles: true,
      },
    });
  }

  /*
   * Lista clientes con búsqueda, filtros y paginación.
   * Esta función será usada por las tablas del frontend.
   */
  async findAll(query: CustomerQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos usar any para no romper las reglas estrictas de TypeScript/ESLint.
     */
    const where: Prisma.CustomerWhereInput = {
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.branchId ? { branchId: query.branchId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),

      /*
       * Búsqueda avanzada:
       * busca coincidencias en nombre, documento, teléfono y correo.
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
                documentNumber: {
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
            ],
          }
        : {}),
    };

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          branch: true,

          /*
           * Incluimos vehículos para mostrar datos rápidos
           * en la lista de clientes.
           */
          vehicles: {
            select: {
              id: true,
              plate: true,
              brand: true,
              model: true,
              year: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.customer.count({
        where,
      }),
    ]);

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Perfil 360 del cliente.
   * Incluye vehículos, cotizaciones, facturas, pagos, citas y recordatorios.
   */
  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        company: true,
        branch: true,

        vehicles: {
          include: {
            workOrders: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 5,
            },
            maintenanceReminders: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },

        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },

        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },

        payments: {
          orderBy: {
            paidAt: 'desc',
          },
          take: 10,
        },

        appointments: {
          orderBy: {
            startAt: 'desc',
          },
          take: 10,
        },

        maintenanceReminders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return customer;
  }

  /*
   * Actualiza datos del cliente.
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    /*
     * Validación de documento duplicado al actualizar.
     */
    if (updateCustomerDto.documentNumber) {
      const existingDocument = await this.prisma.customer.findFirst({
        where: {
          documentNumber: updateCustomerDto.documentNumber,
          id: {
            not: id,
          },
          companyId: updateCustomerDto.companyId,
        },
      });

      if (existingDocument) {
        throw new ConflictException(
          'Ya existe otro cliente con este documento',
        );
      }
    }

    /*
     * Validación de correo duplicado al actualizar.
     */
    if (updateCustomerDto.email) {
      const existingEmail = await this.prisma.customer.findFirst({
        where: {
          email: updateCustomerDto.email,
          id: {
            not: id,
          },
          companyId: updateCustomerDto.companyId,
        },
      });

      if (existingEmail) {
        throw new ConflictException('Ya existe otro cliente con este correo');
      }
    }

    /*
     * Tipamos el data de actualización para evitar unsafe assignment.
     */
    const data: Prisma.CustomerUncheckedUpdateInput = {
      ...updateCustomerDto,
    };

    return this.prisma.customer.update({
      where: { id },
      data,
      include: {
        company: true,
        branch: true,
        vehicles: true,
      },
    });
  }

  /*
   * Eliminación lógica.
   * No borramos el cliente porque podría tener historial,
   * órdenes, pagos, facturas y auditoría.
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
      select: {
        id: true,
        name: true,
        documentNumber: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  /*
   * Métricas rápidas para dashboard del CRM.
   */
  async getStats(companyId?: string, branchId?: string) {
    /*
     * where base tipado.
     * Luego lo reutilizamos para contar clientes por estado.
     */
    const where: Prisma.CustomerWhereInput = {
      ...(companyId ? { companyId } : {}),
      ...(branchId ? { branchId } : {}),
    };

    const [total, active, vip, debtor, inactive] = await Promise.all([
      this.prisma.customer.count({
        where,
      }),

      this.prisma.customer.count({
        where: {
          ...where,
          status: 'ACTIVE',
        },
      }),

      this.prisma.customer.count({
        where: {
          ...where,
          status: 'VIP',
        },
      }),

      this.prisma.customer.count({
        where: {
          ...where,
          status: 'DEBTOR',
        },
      }),

      this.prisma.customer.count({
        where: {
          ...where,
          status: 'INACTIVE',
        },
      }),
    ]);

    return {
      total,
      active,
      vip,
      debtor,
      inactive,
    };
  }
}
