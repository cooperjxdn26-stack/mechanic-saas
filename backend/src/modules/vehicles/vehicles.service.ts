import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un vehículo y lo asocia a un cliente.
   */
  async create(createVehicleDto: CreateVehicleDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: createVehicleDto.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    /*
     * Normalizamos placa a mayúsculas para evitar duplicados:
     * ABC123 y abc123 deberían considerarse la misma placa.
     */
    const normalizedPlate = createVehicleDto.plate.trim().toUpperCase();

    const existingPlate = await this.prisma.vehicle.findUnique({
      where: {
        plate: normalizedPlate,
      },
    });

    if (existingPlate) {
      throw new ConflictException('Ya existe un vehículo con esta placa');
    }

    /*
     * Validamos VIN si fue enviado.
     */
    if (createVehicleDto.vin) {
      const existingVin = await this.prisma.vehicle.findFirst({
        where: {
          vin: createVehicleDto.vin,
        },
      });

      if (existingVin) {
        throw new ConflictException('Ya existe un vehículo con este VIN');
      }
    }

    return this.prisma.vehicle.create({
      data: {
        plate: normalizedPlate,
        brand: createVehicleDto.brand,
        model: createVehicleDto.model,
        year: createVehicleDto.year,
        color: createVehicleDto.color,
        vin: createVehicleDto.vin,
        mileage: createVehicleDto.mileage ?? 0,
        fuelType: createVehicleDto.fuelType,
        transmission: createVehicleDto.transmission,
        type: createVehicleDto.type,
        notes: createVehicleDto.notes,
        customerId: createVehicleDto.customerId,
        branchId: createVehicleDto.branchId,
      },
      include: {
        customer: true,
        branch: true,
      },
    });
  }

  /*
   * Lista vehículos con búsqueda, filtros y paginación.
   */
  async findAll(query: VehicleQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no tener errores de unsafe assignment.
     */
    const where: Prisma.VehicleWhereInput = {
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.branchId ? { branchId: query.branchId } : {}),

      ...(query.search
        ? {
            OR: [
              {
                plate: {
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
                model: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                vin: {
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

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              documentNumber: true,
              phone: true,
              email: true,
            },
          },
          branch: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.vehicle.count({
        where,
      }),
    ]);

    return {
      data: vehicles,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Perfil completo del vehículo.
   * Incluye historial de órdenes, cotizaciones, citas y recordatorios.
   */
  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,

        workOrders: {
          include: {
            mechanic: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            diagnostics: true,
            statusHistory: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },

        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
        },

        appointments: {
          orderBy: {
            startAt: 'desc',
          },
        },

        maintenanceReminders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  /*
   * Actualiza vehículo.
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    /*
     * data tipado con Prisma.
     * Mantiene la misma lógica, pero evita usar any.
     */
    const data: Prisma.VehicleUncheckedUpdateInput = {
      ...updateVehicleDto,
    };

    /*
     * Si actualizan la placa, se normaliza y se valida duplicado.
     */
    if (updateVehicleDto.plate) {
      const normalizedPlate = updateVehicleDto.plate.trim().toUpperCase();

      const existingPlate = await this.prisma.vehicle.findFirst({
        where: {
          plate: normalizedPlate,
          id: {
            not: id,
          },
        },
      });

      if (existingPlate) {
        throw new ConflictException('Ya existe otro vehículo con esta placa');
      }

      data.plate = normalizedPlate;
    }

    /*
     * Validación de VIN duplicado al actualizar.
     */
    if (updateVehicleDto.vin) {
      const existingVin = await this.prisma.vehicle.findFirst({
        where: {
          vin: updateVehicleDto.vin,
          id: {
            not: id,
          },
        },
      });

      if (existingVin) {
        throw new ConflictException('Ya existe otro vehículo con este VIN');
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data,
      include: {
        customer: true,
        branch: true,
      },
    });
  }

  /*
   * Eliminación física del vehículo.
   * OJO: si ya tiene órdenes o historial, Prisma puede impedir borrar
   * según las relaciones. Más adelante podemos cambiar esto a eliminación lógica.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  /*
   * Historial rápido del vehículo.
   * Ideal para una pantalla tipo timeline.
   */
  async getHistory(id: string) {
    await this.findOne(id);

    return this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        workOrders: {
          include: {
            diagnostics: true,
            statusHistory: {
              orderBy: {
                createdAt: 'asc',
              },
            },
            attachments: true,
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        maintenanceReminders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        appointments: {
          orderBy: {
            startAt: 'desc',
          },
        },
      },
    });
  }

  /*
   * Métricas rápidas de vehículos.
   */
  async getStats(branchId?: string) {
    /*
     * where base tipado.
     * Se reutiliza para contar total, kilometraje alto y recordatorios.
     */
    const where: Prisma.VehicleWhereInput = {
      ...(branchId ? { branchId } : {}),
    };

    const [total, withHighMileage, withReminders] = await Promise.all([
      this.prisma.vehicle.count({
        where,
      }),

      /*
       * Vehículos con kilometraje alto.
       * Después podemos volver este umbral configurable.
       */
      this.prisma.vehicle.count({
        where: {
          ...where,
          mileage: {
            gte: 100000,
          },
        },
      }),

      /*
       * Vehículos que tienen recordatorios pendientes.
       */
      this.prisma.vehicle.count({
        where: {
          ...where,
          maintenanceReminders: {
            some: {
              status: 'PENDING',
            },
          },
        },
      }),
    ]);

    return {
      total,
      withHighMileage,
      withReminders,
    };
  }
}
