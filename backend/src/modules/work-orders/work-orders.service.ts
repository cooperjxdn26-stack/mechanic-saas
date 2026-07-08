import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../../database/prisma.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { WorkOrderQueryDto } from './dto/work-order-query.dto';
import { ChangeWorkOrderStatusDto } from './dto/change-work-order-status.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Genera un código legible para la orden.
   * Ejemplo: OT-2026-000123
   */
  private async generateCode() {
    const year = new Date().getFullYear();

    const count = await this.prisma.workOrder.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    });

    const nextNumber = String(count + 1).padStart(6, '0');

    return `OT-${year}-${nextNumber}`;
  }

  /*
   * Crea una nueva orden de trabajo.
   * También crea automáticamente el primer registro del historial de estado.
   */
  async create(createWorkOrderDto: CreateWorkOrderDto, userId?: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: createWorkOrderDto.vehicleId,
      },
      include: {
        customer: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    /*
     * Si se envía mecánico, validamos que exista.
     */
    if (createWorkOrderDto.mechanicId) {
      const mechanic = await this.prisma.user.findUnique({
        where: {
          id: createWorkOrderDto.mechanicId,
        },
      });

      if (!mechanic) {
        throw new NotFoundException('Mecánico no encontrado');
      }
    }

    const code = await this.generateCode();

    const existingCode = await this.prisma.workOrder.findUnique({
      where: { code },
    });

    if (existingCode) {
      throw new ConflictException('Ya existe una orden con este código');
    }

    /*
     * qrToken servirá después para la vista pública del cliente.
     * El cliente podrá consultar el avance sin iniciar sesión.
     */
    const qrToken = randomUUID();

    const status = createWorkOrderDto.status ?? 'RECEIVED';

    /*
     * Transacción:
     * Garantiza que se cree la orden y su historial juntos.
     * Si una operación falla, ninguna se guarda.
     */
    return this.prisma.$transaction(async (tx) => {
      const workOrder = await tx.workOrder.create({
        data: {
          code,
          reason: createWorkOrderDto.reason,
          reportedSymptoms: createWorkOrderDto.reportedSymptoms,
          initialDiagnosis: createWorkOrderDto.initialDiagnosis,
          internalNotes: createWorkOrderDto.internalNotes,
          status,
          priority: createWorkOrderDto.priority ?? 'MEDIUM',
          estimatedDelivery: createWorkOrderDto.estimatedDelivery
            ? new Date(createWorkOrderDto.estimatedDelivery)
            : undefined,
          vehicleId: createWorkOrderDto.vehicleId,
          mechanicId: createWorkOrderDto.mechanicId,
          branchId: createWorkOrderDto.branchId,
          createdById: userId,
          qrToken,
        },
        include: {
          vehicle: {
            include: {
              customer: true,
            },
          },
          mechanic: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          branch: true,
        },
      });

      /*
       * Primer historial de estado.
       * Esto permite construir timeline desde el inicio.
       */
      await tx.workOrderStatusHistory.create({
        data: {
          oldStatus: null,
          newStatus: status,
          notes: 'Orden creada',
          workOrderId: workOrder.id,
          changedById: userId,
        },
      });

      return workOrder;
    });
  }

  /*
   * Lista órdenes con búsqueda, filtros y paginación.
   * Ideal para tabla administrativa.
   */
  async findAll(query: WorkOrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para no generar errores de unsafe assignment.
     */
    const where: Prisma.WorkOrderWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.mechanicId ? { mechanicId: query.mechanicId } : {}),
      ...(query.vehicleId ? { vehicleId: query.vehicleId } : {}),
      ...(query.branchId ? { branchId: query.branchId } : {}),

      ...(query.from || query.to
        ? {
            receivedAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),

      /*
       * Búsqueda avanzada cruzando vehículo y cliente.
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
                reason: {
                  contains: query.search,
                  mode: 'insensitive',
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
              {
                vehicle: {
                  customer: {
                    name: {
                      contains: query.search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      this.prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          vehicle: {
            include: {
              customer: true,
            },
          },
          mechanic: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          branch: true,
          diagnostics: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.workOrder.count({
        where,
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Detalle completo de una orden.
   * Incluye todo lo necesario para la pantalla principal de reparación.
   */
  async findOne(id: string) {
    const order = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        branch: true,
        diagnostics: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        checklists: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            changedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        attachments: true,
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }

    return order;
  }

  /*
   * Actualiza información general de la orden.
   * Para cambiar estado usamos un método separado para guardar historial.
   */
  async update(id: string, updateWorkOrderDto: UpdateWorkOrderDto) {
    await this.findOne(id);

    if (updateWorkOrderDto.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: {
          id: updateWorkOrderDto.vehicleId,
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehículo no encontrado');
      }
    }

    if (updateWorkOrderDto.mechanicId) {
      const mechanic = await this.prisma.user.findUnique({
        where: {
          id: updateWorkOrderDto.mechanicId,
        },
      });

      if (!mechanic) {
        throw new NotFoundException('Mecánico no encontrado');
      }
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        reason: updateWorkOrderDto.reason,
        reportedSymptoms: updateWorkOrderDto.reportedSymptoms,
        initialDiagnosis: updateWorkOrderDto.initialDiagnosis,
        internalNotes: updateWorkOrderDto.internalNotes,
        priority: updateWorkOrderDto.priority,
        estimatedDelivery: updateWorkOrderDto.estimatedDelivery
          ? new Date(updateWorkOrderDto.estimatedDelivery)
          : undefined,
        vehicleId: updateWorkOrderDto.vehicleId,
        mechanicId: updateWorkOrderDto.mechanicId,
        branchId: updateWorkOrderDto.branchId,
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        mechanic: true,
        branch: true,
      },
    });
  }

  /*
   * Cambia el estado de una orden y registra historial.
   * Este método es clave para timeline, Kanban y auditoría operativa.
   */
  async changeStatus(
    id: string,
    dto: ChangeWorkOrderStatusDto,
    userId?: string,
  ) {
    const currentOrder = await this.prisma.workOrder.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }

    /*
     * Evitamos registrar cambios innecesarios si el estado es el mismo.
     */
    if (currentOrder.status === dto.status) {
      return {
        message: 'La orden ya tiene este estado',
        order: currentOrder,
      };
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.workOrder.update({
        where: { id },
        data: {
          status: dto.status,

          /*
           * Si el estado pasa a DELIVERED, guardamos fecha de entrega.
           */
          deliveredAt: dto.status === 'DELIVERED' ? new Date() : undefined,
        },
        include: {
          vehicle: {
            include: {
              customer: true,
            },
          },
          mechanic: true,
        },
      });

      /*
       * Historial del cambio de estado.
       * Con esto luego armamos timeline visual.
       */
      await tx.workOrderStatusHistory.create({
        data: {
          oldStatus: currentOrder.status,
          newStatus: dto.status,
          notes: dto.notes,
          workOrderId: id,
          changedById: userId,
        },
      });

      return updatedOrder;
    });
  }

  /*
   * Crea un item de checklist para una orden.
   */
  async addChecklistItem(
    workOrderId: string,
    createChecklistItemDto: CreateChecklistItemDto,
  ) {
    await this.findOne(workOrderId);

    return this.prisma.inspectionChecklist.create({
      data: {
        item: createChecklistItemDto.item,
        status: createChecklistItemDto.status ?? 'PENDING',
        notes: createChecklistItemDto.notes,
        workOrderId,
      },
    });
  }

  /*
   * Actualiza un item del checklist.
   */
  async updateChecklistItem(
    checklistId: string,
    updateDto: CreateChecklistItemDto,
  ) {
    const checklist = await this.prisma.inspectionChecklist.findUnique({
      where: { id: checklistId },
    });

    if (!checklist) {
      throw new NotFoundException('Item de checklist no encontrado');
    }

    return this.prisma.inspectionChecklist.update({
      where: { id: checklistId },
      data: {
        item: updateDto.item,
        status: updateDto.status,
        notes: updateDto.notes,
      },
    });
  }

  /*
   * Vista Kanban agrupada por estados.
   * El frontend puede renderizar columnas con esta respuesta.
   */
  async getKanban(branchId?: string) {
    const statuses = [
      'PENDING',
      'RECEIVED',
      'IN_DIAGNOSIS',
      'WAITING_APPROVAL',
      'IN_REPAIR',
      'IN_TESTING',
      'COMPLETED',
      'DELIVERED',
      'CANCELLED',
    ] as const;

    const columns = await Promise.all(
      statuses.map(async (status) => {
        const orders = await this.prisma.workOrder.findMany({
          where: {
            status,
            ...(branchId ? { branchId } : {}),
          },
          include: {
            vehicle: {
              include: {
                customer: true,
              },
            },
            mechanic: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: [
            {
              priority: 'desc',
            },
            {
              estimatedDelivery: 'asc',
            },
          ],
        });

        return {
          status,
          count: orders.length,
          orders,
        };
      }),
    );

    return columns;
  }

  /*
   * Panel del mecánico.
   * Devuelve las órdenes asignadas a un mecánico específico.
   */
  async getMechanicPanel(mechanicId: string) {
    const mechanic = await this.prisma.user.findUnique({
      where: { id: mechanicId },
      include: {
        role: true,
      },
    });

    if (!mechanic) {
      throw new NotFoundException('Mecánico no encontrado');
    }

    const orders = await this.prisma.workOrder.findMany({
      where: {
        mechanicId,
        status: {
          in: [
            'RECEIVED',
            'IN_DIAGNOSIS',
            'WAITING_APPROVAL',
            'IN_REPAIR',
            'IN_TESTING',
          ],
        },
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        diagnostics: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        checklists: true,
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          estimatedDelivery: 'asc',
        },
      ],
    });

    return {
      mechanic: {
        id: mechanic.id,
        firstName: mechanic.firstName,
        lastName: mechanic.lastName,
        email: mechanic.email,
        role: mechanic.role?.name,
      },
      orders,
    };
  }

  /*
   * Timeline operativo de una orden.
   * Junta historial de estados, diagnósticos, checklist y comentarios.
   */
  async getTimeline(id: string) {
    await this.findOne(id);

    const [statusHistory, diagnostics, checklists, comments] =
      await Promise.all([
        this.prisma.workOrderStatusHistory.findMany({
          where: {
            workOrderId: id,
          },
          include: {
            changedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),

        this.prisma.diagnostic.findMany({
          where: {
            workOrderId: id,
          },
          include: {
            mechanic: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),

        this.prisma.inspectionChecklist.findMany({
          where: {
            workOrderId: id,
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),

        this.prisma.comment.findMany({
          where: {
            workOrderId: id,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),
      ]);

    return {
      workOrderId: id,
      statusHistory,
      diagnostics,
      checklists,
      comments,
    };
  }

  /*
   * Métricas rápidas de órdenes.
   */
  async getStats(branchId?: string) {
    /*
     * where base tipado.
     * Se reutiliza para contar órdenes por estado, prioridad y atraso.
     */
    const where: Prisma.WorkOrderWhereInput = {
      ...(branchId ? { branchId } : {}),
    };

    const now = new Date();

    const [total, active, completed, delivered, cancelled, overdue, urgent] =
      await Promise.all([
        this.prisma.workOrder.count({
          where,
        }),

        this.prisma.workOrder.count({
          where: {
            ...where,
            status: {
              in: [
                'PENDING',
                'RECEIVED',
                'IN_DIAGNOSIS',
                'WAITING_APPROVAL',
                'IN_REPAIR',
                'IN_TESTING',
              ],
            },
          },
        }),

        this.prisma.workOrder.count({
          where: {
            ...where,
            status: 'COMPLETED',
          },
        }),

        this.prisma.workOrder.count({
          where: {
            ...where,
            status: 'DELIVERED',
          },
        }),

        this.prisma.workOrder.count({
          where: {
            ...where,
            status: 'CANCELLED',
          },
        }),

        /*
         * Órdenes atrasadas:
         * fecha estimada menor a ahora y aún no entregadas/canceladas.
         */
        this.prisma.workOrder.count({
          where: {
            ...where,
            estimatedDelivery: {
              lt: now,
            },
            status: {
              notIn: ['DELIVERED', 'CANCELLED'],
            },
          },
        }),

        this.prisma.workOrder.count({
          where: {
            ...where,
            priority: 'URGENT',
          },
        }),
      ]);

    return {
      total,
      active,
      completed,
      delivered,
      cancelled,
      overdue,
      urgent,
    };
  }
}
