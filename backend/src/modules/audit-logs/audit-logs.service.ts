import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un registro de auditoría.
   *
   * Este método puede ser llamado desde cualquier servicio del sistema:
   * clientes, vehículos, órdenes, inventario, pagos, caja, etc.
   *
   * Ejemplo:
   * - CREATE Customer
   * - UPDATE Vehicle
   * - OPEN CashRegister
   * - CLOSE CashRegister
   */
  async create(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        action: dto.action,
        module: dto.module,
        entity: dto.entity,
        entityId: dto.entityId,
        description: dto.description,

        /*
         * Metadata permite guardar información extra en formato JSON.
         * Ejemplo:
         * { oldStatus: "PENDING", newStatus: "COMPLETED" }
         */
        metadata: dto.metadata,

        /*
         * Datos técnicos opcionales.
         * Sirven para rastrear desde dónde se hizo la acción.
         */
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,

        /*
         * Relaciones opcionales.
         * Si existe usuario o empresa, se vinculan al registro.
         */
        companyId: dto.companyId,
        userId: dto.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: true,
      },
    });
  }

  /*
   * Lista registros de auditoría con filtros y paginación.
   *
   * Filtros disponibles:
   * - action
   * - module
   * - entity
   * - entityId
   * - userId
   * - companyId
   * - from
   * - to
   */
  async findAll(query: AuditLogQueryDto) {
    /*
     * Convertimos page y limit de forma segura.
     * A veces llegan como string desde query params.
     */
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

    const skip = (safePage - 1) * safeLimit;

    /*
     * Filtro dinámico tipado con Prisma.
     * Esto evita usar any y evita errores de unsafe assignment.
     */
    const where: Prisma.AuditLogWhereInput = {
      ...(query.action ? { action: query.action } : {}),
      ...(query.module ? { module: query.module } : {}),
      ...(query.entity ? { entity: query.entity } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.companyId ? { companyId: query.companyId } : {}),

      /*
       * Filtro por rango de fechas.
       * from = fecha inicial
       * to = fecha final
       */
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: safeLimit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          company: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.auditLog.count({
        where,
      }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        lastPage: Math.ceil(total / safeLimit),
      },
    };
  }

  /*
   * Historial de una entidad específica.
   *
   * Ejemplo:
   * /audit-logs/entity/WorkOrder/ID_ORDEN
   *
   * Esto permite ver todo lo que pasó con una orden,
   * cliente, vehículo, factura, caja, etc.
   */
  async findByEntity(entity: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
